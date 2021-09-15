import './sass/main.scss';
import axios from 'axios'
import Notiflix from 'notiflix';

function Ctrl() {
  const self = this;
  const baseUrl = 'https://pixabay.com/api/';
  const pixabayParams =  {
    key: '23396378-fed243cf5b1bf6c558340d468',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true
  };
  const pagination = {
    page: 1,
    per_page: 40
  }
  let contentHolder = null;
  let buttonHolder = null;

  const callApi = async (searchTerm) => {
    const {data: {hits}} = await axios.get(baseUrl, {
      params: {
        ...pixabayParams,
        ...pagination,
        q: searchTerm
      }
    })

    if (!hits.length) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      return []
    }
    
    Notiflix.Notify.success('"Hooray! We found images.')
    
    return hits.map(hit => ({
      webformatURL: hit.webformatURL, 
      tags: hit.tags,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads
    }))
  }

  const buildItemHtml = ({
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads
  }) => `
    <div class="flex flex-col item-result-wrapper">
      <img height="200" width="300" alt="${tags}" src="${webformatURL}"/>
      <div class="flex justify--between counters-wrapper">
          <div class="flex flex-col items--center counter-item">
            <span class="counter-title">Likes</span>
            <span>${likes}</span>
          </div>
          <div class="flex flex-col items--center counter-item">
            <span class="counter-title">Views</span>
            <span>${views}</span>
          </div>
          <div class="flex flex-col items--center counter-item">
            <span class="counter-title">Comments</span>
            <span>${comments}</span>
          </div>
          <div class="flex flex-col items--center counter-item">
            <span class="counter-title">Downloads</span>
            <span>${downloads}</span>
          </div>
      </div>
    </div>
  `

  self.data = []

  self.search =  async (searchField, paginationPage) => {
    buttonHolder.classList.remove('show')
    if (!searchField.value) {
      return
    }
    pagination.page = paginationPage || 1
    const data = await callApi(searchField.value)
    
    if (data.length) {
      self.data = data
      contentHolder.innerHTML = self.data.map(item => buildItemHtml(item)).join(' ')
      buttonHolder.classList.add('show')
    } else {
      contentHolder.innerHTML = ''
    }
  }
  self.loadMore = async (searchField) => {
    if (!searchField.value) {
      return
    }
    pagination.page += 1;
    const data = await callApi(searchField.value)
    if (data.length) {
      self.data = [...self.data, ...data]
      contentHolder.innerHTML = self.data.map(item => buildItemHtml(item)).join(' ')
    } else {
      buttonHolder.classList.remove('show')
    }
  }

  self.setContentHolder = (element) => {
    contentHolder = element
  }

  self.setButtonHolder = (element) => {
    buttonHolder = element
  }

  return self
} 

window.Ctrl = new Ctrl()
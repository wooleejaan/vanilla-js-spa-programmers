import { routeChange } from "./router.js"

export default function ProductList({ $target, initialState }){
  const $productList = document.createElement('ul')
  $target.appendChild($productList)

  this.state = initialState.slice(0, 10)

  this.setState = (nextState) => {
    this.state = nextState 
    this.render() 
  }

  this.render = () => {
    if(!this.state) return 

    $productList.innerHTML = `
      ${this.state.map((product) => 
        `
          <li class="Product" data-product-id="${product.id}">
            <img src="${product.thumbnailUrl}">
            <div class="Product__info">
              <div>${product.title}</div>
            </div>
          </li>
        `
      ).join('')}
    `
  }

  this.render() 

  $productList.addEventListener('click', (e) => {
    const $li = e.target.closest('li')
    const { productId } = $li.dataset 

    if(productId){
      routeChange(`/products/${productId}`)
    }
  })
}
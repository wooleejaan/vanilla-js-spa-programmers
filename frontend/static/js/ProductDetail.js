import SelectedOptions from "./SelectedOptions.js"

export default function ProductDetail({ $target, initialState }){
  const $productDetail = document.createElement('div')
  $productDetail.className = 'ProductDetail'

  $target.appendChild($productDetail)

  this.state = initialState 
  let selectedOptions = null 

  this.setState = nextState => {
    this.state = nextState 
    this.render()

    if(selectedOptions){
      selectedOptions.setState({
        ...this.state,
        selectedOptions: this.state.selectedOptions 
      })
    }
  }

  this.render = () => {
    const { product } = this.state 

    product.price = 1_000_000

    product.productOptions = [
      { name: '옵션1', id: 1, stock: 0, price: 100_000 },
      { name: '옵션2', id: 2, stock: 1, price: 200_000 },
      { name: '옵션3', id: 3, stock: 2, price: 300_000 },
    ]
    // console.log(product)

    $productDetail.innerHTML = `
      <img src="${product.thumbnailUrl}">
      <div class="ProductDetail__info">
        <h2>${product.title}</h2>
        <div class="ProductDetail__price">${product.price}원</div>
        <select>
          <options>선택하세요.</options>
          ${product.productOptions.map(option => 
            `
              <option value="${option.id}" ${option.stock === 0 ? "disabled" : ""}>
                ${option.stock === 0 ? "(품절)" : ""}${product.title} ${option.name} ${option.price > 0 ? `(+${option.price}원)` : ""}
              </option>
            `
          ).join('')}
        </select>
        <div class="ProductDetail__selectedOptions"></div>
      </div>
    `

    selectedOptions = new SelectedOptions({
      $target: $productDetail.querySelector('.ProductDetail__selectedOptions'),
      initialState: {
        product: this.state.product,
        selectedOptions: this.state.selectedOptions 
      }
    })
  }
  this.render() 

  // 이벤트 바인딩 코드 
  // 이벤트 위임 기법을 이용해 이벤트 자체는 ProductDetail 최상위의 div에서 처리 
  $productDetail.addEventListener('change', e => {
    // 이벤트 발생 주체가 select 태그인 경우에만 
    if(e.target.tagName === 'SELECT'){
      // 상품 옵션을 나타내는 option의 value에는 optionId를 담고 있다. 
      // 이를 가져와서 숫자값을 바꾼다. 
      const selectedOptionId = parseInt(e.target.value)
      const { product, selectedOptions } = this.state 
      // 상품의 옵션 데이터에서 현재 선택한 optionId가 존재하는지 찾는다. 
      const option = product.productOptions.find(option => option.id === selectedOptionId)
      // 이미 선택한 상품인지 선택된 상품 데이터에서 찾는다. 
      const selectedOption = selectedOptions.find(selectedOption => selectedOption.optionId === selectedOptionId)

      // 존재하는 옵션이고 선택된 옵션이 아닌 경우에만 selectOptions에 현재 선택한 옵션을 추가 
      if(option && !selectedOption){
        const nextSelectedOptions = [
          ...selectedOptions,
          {
            productId: product.id,
            optionId: option.id,
            optionName: option.name, 
            optionPrice: option.price,
            quantity: 1
          }
        ]
        this.setState({
          ...this.state,
          selectedOptions: nextSelectedOptions
        })
      }
    }
  })
  
  
}
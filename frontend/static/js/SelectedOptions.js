export default function SelectedOptions({ $target, initialState }){
  const $component = document.createElement('div')
  $target.appendChild($component)

  this.state = initialState 

  // 상품 가격 총합 구하기 
  this.getTotalPrice = () => {
    const { product, selectedOptions } = this.state 
    // const { price: productPrice } = product 

    return selectedOptions.reduce(
      (acc, option) => acc + ((product.price + option.optionPrice) * option.quantity), 0
      // (acc, option) => acc + ((productPrice + option.optionPrice) * option.quantity), 0
    )
  }

  this.setState = (nextState) => {
    this.state = nextState 
    this.render()
  }

  this.render = () => {
    const { product, selectedOptions = [] } = this.state 

    if(product && selectedOptions){
      $component.innerHTML = `
        <h3>선택된 상품</h3>
        <ul>
          ${selectedOptions.map(selectedOption => `
            <li> 
              ${selectedOption.optionName} ${product.price + selectedOption.optionPrice}원 
              <input type="text" data-optionId="${selectedOption.optionId}" value="${selectedOption.quantity}"> 
            </li>
          `).join('')}
        </ul>
        <div class="ProductDetail__totalPirce">총 주문금액 : ${this.getTotalPrice()}원</div>
        <button class="OrderButton">주문하기</button>
      `
    }
  }
  this.render() 
  // console.log(this.state)

  // 왜 this.state의 product 속성이 사라지지? => ProductDetail의 setState 코드에서 객체 내 ...this.state 코드 추가 
  $component.addEventListener('change', e => {
    // 이벤트 위임 활용 
    // 이벤트가 INPUT 태그에서 발생한 경우에만 처리 
    if(e.target.tagName === 'INPUT'){
      try {
        const nextQuantity = parseInt(e.target.value)
        const nextSelectedOptions = [ ...this.state.selectedOptions ]
        // input 값이 숫자인 경우에만 처리 
        if(typeof nextQuantity === 'number'){
          const { product } = this.state 

          // console.log(e.target.dataset.optionid, e.target.dataset.optionId) // html 속성이므로 소문자로 찾아야 한다. 
          const optionId = parseInt(e.target.dataset.optionid)
          const option = product.productOptions.find(option => option.id === optionId)
          const selectedOptionIndex = nextSelectedOptions.findIndex(selectedOption => selectedOption.optionId === optionId)
          // input에 입력한 값이 재고 수량을 넘을 경우 재고수량으로 입력한 것으로 강제 교체 
          nextSelectedOptions[selectedOptionIndex].quantity = option.stock >= nextQuantity ? nextQuantity : option.stock 

          this.setState({
            ...this.state,
            selectedOptions: nextSelectedOptions
          })
        }
      } catch(e){
        console.log(e)
      }
    }
  })
}
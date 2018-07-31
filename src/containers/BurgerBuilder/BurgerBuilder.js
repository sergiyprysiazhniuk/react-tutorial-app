import React, { Component, Fragment } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 1.3,
  meat: 0.4,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: null,
  }

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(({data}) => data)
      .then(ingredients => {
        this.setState({ingredients})
      })
      .catch(error => {
        this.setState({error})
      })
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.setState({loading: true});

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'S. P.',
        address: {
          street: 'Test street',
          zipCode: '12345',
          country: 'Honduras'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({loading: false, purchasing: false});
      })
      .catch(err => {
        this.setState({loading: false, purchasing: false});
      });
  }

  updatedPurchaseState(ingredients) {
    const sum  = Object.keys(ingredients)
      .map(key => ingredients[key])
      .reduce((a, b) => a + b);

    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {...this.state.ingredients};
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    updatedIngredients[type] = updatedCount;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatedPurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0){
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {...this.state.ingredients};
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    updatedIngredients[type] = updatedCount;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatedPurchaseState(updatedIngredients);
  }

  render(){
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (const key in disabledInfo) {
      if (disabledInfo.hasOwnProperty(key)) {
         disabledInfo[key] = disabledInfo[key] <= 0;
      }
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />; 

    if(this.state.ingredients){
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}/>;

      burger = <Fragment>
        <Burger ingredients={this.state.ingredients} />
          <BuildControls
            price={this.state.totalPrice}
            ingredientRemoved={this.removeIngredientHandler}
            ingredientAdded={this.addIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}/>
      </Fragment>
    }

    if(this.state.loading){
      orderSummary = <Spinner />
    }

    return (
      <Fragment>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Fragment>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);
import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from '../Checkout/ContactData/ContactData';

class Checkout extends Component {
  state = {
    ingredients: null,
    totalPrice: 0
  }

  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;

    for (const param of query) {
      if(param[0] === 'price'){
        price = param[1];
      }else{
        ingredients[param[0]] = +param[1];
      }
    }
    
    this.setState({ ingredients, totalPrice: price });
  }
  

  cancelledHandler = () => {

    console.log(this.props)

    this.props.history.goBack();
  }

  continuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    return (
      <div>
        <CheckoutSummary 
          ingredients={this.state.ingredients}
          cancelled={this.cancelledHandler}
          continued={this.continuedHandler}/>
        <Route 
          path={this.props.match.path + '/contact-data'}
          render={(props) => (<ContactData {...props} ingredients={this.state.ingredients} price={this.state.totalPrice} />)}/>
      </div>
    );
  }
}

export default Checkout;

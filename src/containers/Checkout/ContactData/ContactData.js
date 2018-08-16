import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'},
          ]
        },
        value: 'fastest',
        validation: {},
        valid: true
      },
    },
    loading: false,
    formIsValid: false,
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});

    const formData = Object.keys(this.state.orderForm)
      .reduce((data, key) => ({...data, [key]: this.state.orderForm[key].value}), {})

    console.log('formData', formData)

    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    };

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({loading: false});
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({loading: false});
      });
  }

  checkValidity(value, rules){
    let valid = true;

    if(!rules){
      return valid;
    }
    if(rules.required){
      valid = value.trim() !== '' && valid;
    }
    if(rules.minLength){
      valid = value.length >= rules.minLength  && valid;
    }
    if(rules.maxLength){
      valid = value.length <= rules.maxLength  && valid;
    }

    return valid;
  }

  inputChangedHandler = (event, inputId) => {
    const updatedOrderForm = {...this.state.orderForm};
    const updatedFormElement = {...updatedOrderForm[inputId]};

    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedOrderForm[inputId] = updatedFormElement;

    const formIsValid = Object.keys(updatedOrderForm)
      .filter(key => updatedOrderForm[key].validation)
      .every(key => updatedOrderForm[key].valid);

    console.log('formIsValid', formIsValid)

    this.setState({orderForm: updatedOrderForm, formIsValid});
  }

  render() {
    const formElements = Object.keys(this.state.orderForm)
      .map(key => ({
        id: key,
        config: this.state.orderForm[key],
      }))

    let form = (
        <form onSubmit={this.orderHandler}>
          {formElements.map(element => (
            <Input 
              key={element.id}
              elementType={element.config.elementType}
              elementConfig={element.config.elementConfig}
              value={element.config.value}
              invalid={!element.config.valid}
              shouldValidate={element.config.validation}
              touched={element.config.touched}
              changed={(event) => this.inputChangedHandler(event, element.id)} />
          ))}
          <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        </form>
    );

    if(this.state.loading){
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;

import React from 'react';
import classes from './Order.css';

const Order = (props) => {
  const ingredients = Object.keys(props.ingredients)
    .filter(ingredient => props.ingredients[ingredient])
    .map(ingredient => (
      <span key={ingredient} style={{
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '0 8px',
        border: '1px solid #ccc',
        padding: '5px'
      }}>{ingredient} ({props.ingredients[ingredient]})</span>
    ))

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredients}</p>
      <p>Price: <strong>USD: {props.price.toFixed(2)}</strong></p>
    </div>
  );
}

export default Order;

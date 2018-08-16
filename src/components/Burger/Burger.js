import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.css'

const Burger = (props) => {
  console.log('Burger', props);

  let transformedIngredients = Object.keys(props.ingredients)
    .map(ingredient => {
      return [...Array(props.ingredients[ingredient])]
      .map(((_, index) => {
        return <BurgerIngredient key={ingredient + index} type={ingredient} />
      }));
    })
    .reduce((prev, curr) => prev.concat(curr), []);

    console.log(transformedIngredients);
    
    if(!transformedIngredients.length){
      transformedIngredients = <p>Please start adding ingredients</p>
    }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default Burger
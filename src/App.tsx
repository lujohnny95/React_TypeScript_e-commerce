import { useState } from "react";
import { useQuery } from "react-query";
import { Badge, Drawer, LinearProgress, Grid, AppBar, Toolbar, IconButton, Typography } from "@material-ui/core"
import { AddShoppingCart } from "@material-ui/icons";
//components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
//styles
import { Wrapper, StyledButton } from "./App.styles";

//type of each cart item object
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

//api fetch
const getProducts = async (): Promise<CartItemType[]> => 
  await (await fetch("https://fakestoreapi.com/products")).json();


function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  console.log(data)
  
  //running total price
  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((acc:number, item) => acc + item.amount, 0)

  //add item to cart
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(item => 
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item 
        );
      }
      // item is added the first time
      return [...prev, { ...clickedItem, amount: 1 }];
    })
  };

  //remove item from cart
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => 
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.amount === 1) return acc;
          return [...acc, { ...item, amount: item.amount - 1 }];
        } else {
          return [ ...acc, item ];
        }
      }, [] as CartItemType[])
    )
  };

    if (isLoading) return <LinearProgress />;
    if (error) return <div>Something went wrong...</div>;


  return (
    <>
    <AppBar>
      <Toolbar>
        <Typography>Net-Shopper</Typography>
        <StyledButton onClick={() => setCartOpen(true)}>
          <Badge badgeContent={getTotalItems(cartItems)} color="secondary">
            <AddShoppingCart />
          </Badge>
        </StyledButton>
      </Toolbar>
    </AppBar>
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
    </>
  );
}

export default App;

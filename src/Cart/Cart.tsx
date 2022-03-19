import CartItem from "../CartItem/CartItem";
import { CartItemType } from "../App";
import { Wrapper } from "./Cart.styles";

type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const calculateTotal = (items: CartItemType[]) => 
        items.reduce((acc: number, item) => acc + item.amount * item.price, 0); 
    

    return (
        <Wrapper>
            <h2>Your Order</h2>
            {cartItems.length === 0 && <p>Your cart is empty</p>}
            {cartItems.map(item => (
                <CartItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
            <h2>Total: £{calculateTotal(cartItems).toFixed(2)}</h2>
        </Wrapper>
    )
}

export default Cart;

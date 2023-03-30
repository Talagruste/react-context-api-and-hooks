import { Button } from '../../components/Button';
import { Heading } from '../../components/Heading';
import { useCounterContext } from '../../contexts/CounterContext';

export const Home = () => {
  const [state, actions] = useCounterContext();

  return (
    <div>
      <Heading />

      <div>
        <Button onButtonClick={actions.increase}>Increase</Button> <br />
        <Button onButtonClick={actions.decrease}>Decrease</Button> <br />
        <Button onButtonClick={actions.reset}>Reset</Button> <br />
        <Button onButtonClick={() => actions.setCounter({ counter: 10 })}>Set Counter 10</Button> <br />
        <Button onButtonClick={() => actions.setCounter({ counter: 100 })}>Set Counter 100</Button> <br />
        <Button disabled={state.loading} onButtonClick={actions.asyncIncrease}>
          Async Increase
        </Button>
        <br />
        <Button disabled={state.loading} onButtonClick={actions.asyncError}>
          Async Error
        </Button>
        <br />
      </div>
    </div>
  );
};

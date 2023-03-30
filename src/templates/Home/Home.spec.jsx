import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from '.';
import userEvent from '@testing-library/user-event';

const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'title 1',
          body: 'body 1',
          url: 'img1.jpg',
        },
        {
          userId: 2,
          id: 2,
          title: 'title 2',
          body: 'body 2',
          url: 'img2.jpg',
        },
        {
          userId: 3,
          id: 3,
          title: 'title 3',
          body: 'body 3',
          url: 'img3.jpg',
        },
      ]),
    );
  }),
];

const servers = setupServer(...handlers);

describe('<Home />', () => {
  beforeAll(() => {
    servers.listen();
  });

  afterEach(() => servers.resetHandlers());

  afterAll(() => {
    servers.close();
  });

  it('should render search, posts and load more', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts com essa busca.');

    expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/Type your search/i);
    expect(search).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should search for posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts com essa busca.');

    expect.assertions(11);

    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/Type your search/i);
    expect(screen.getByRole('heading', { name: 'title 11' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title 22' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title 33' })).toBeInTheDocument();

    userEvent.type(search, 'title 1');
    expect(screen.getByRole('heading', { name: 'title 11' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title 22' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title 33' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search value: title 1' })).toBeInTheDocument();

    userEvent.clear(search);
    expect(screen.getByRole('heading', { name: 'title 11' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title 22' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title 33' })).toBeInTheDocument();

    userEvent.type(search, 'texto qualquer');
    expect(screen.getByText('Não existem posts com essa busca.')).toBeInTheDocument();
  });

  it('should load more posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts com essa busca.');

    //expect.assertions(3);

    await waitForElementToBeRemoved(noMorePosts);

    const button = screen.getByRole('button', { name: /load more posts/i });

    userEvent.click(button);
    expect(screen.getByRole('heading', { name: 'title 22' })).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});

module.exports = {
    babel: {
      plugins: [
        [
          '@linaria/babel-preset',
          {
            evaluate: true,
            displayName: true,
          },
        ],
      ],
    },
  };
  
export const axiosMock = {
  get: jest.fn().mockResolvedValue({
    data: {
      localidade: 'São Paulo',
      uf: 'SP',
      gia: '1004',
    },
  }),
};

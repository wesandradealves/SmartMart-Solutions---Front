// utils.ts

// Converte pixel pra rem
// O padrão é 16px, mas pode ser alterado passando o segundo parâmetro
export const pxToRem = (px: number, basefontSize: number = 16): string => {
    return `${px / basefontSize}rem`;
};
  
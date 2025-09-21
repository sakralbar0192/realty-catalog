import { create } from '@storybook/theming'

export default create({
  base: 'light',
  brandTitle: 'Realty Catalog',
  brandUrl: 'https://github.com/your-repo',
  brandImage: 'https://via.placeholder.com/150x50?text=Realty+Catalog',
  
  // Colors
  colorPrimary: '#007bff',
  colorSecondary: '#6c757d',
  
  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#dee2e6',
  appBorderRadius: 4,
  
  // Text colors
  textColor: '#212529',
  textInverseColor: '#ffffff',
  
  // Toolbar default and active colors
  barTextColor: '#9e9e9e',
  barSelectedColor: '#007bff',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#ced4da',
  inputTextColor: '#212529',
  inputBorderRadius: 4,
})

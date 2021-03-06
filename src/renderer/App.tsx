import './App.css'
import { SnackbarProvider } from 'notistack'
import { createStore, compose } from 'redux'

import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { green } from '@mui/material/colors'
import MainView from './views/mainView'
import dataReducer from './Store/Reducers/data'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(dataReducer, composeEnhancers())

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: green[700]
      }
    },
    typography: {
      fontSize: 10
    }
  })

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <MainView />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
export { store }
export type RootState = ReturnType<typeof store.getState>

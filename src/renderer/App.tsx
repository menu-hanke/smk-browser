import './App.css'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@material-ui/core/styles'
import { createTheme } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import MainView from './views/mainView'

export default function App() {
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
  <div>
   <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={1}>
     <MainView />
    </SnackbarProvider>
   </ThemeProvider>
  </div>
 )
}

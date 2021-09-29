import './App.css';
import MainView from './views/mainView';
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: green[700]
      }
    }, typography: {
      fontSize: 10,
    }
  })

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <MainView />
        </SnackbarProvider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;

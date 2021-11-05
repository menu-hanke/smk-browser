import './App.css';
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import MainView from './views/mainView';

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: green[700],
      },
    },
    typography: {
      fontSize: 10,
    },
  });

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1}>
          <MainView />
        </SnackbarProvider>
      </MuiThemeProvider>
    </div>
  );
}

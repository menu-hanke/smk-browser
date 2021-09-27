import * as React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

interface Log {
  type: string,
  message: string
}

interface LogComponentInterface {
  logData: Log[]
}

const LogComponent: React.FC<LogComponentInterface> = ({ logData }) => {
  const classes = useStyles()
  const [logContainerwidth, setLogContainerWidth] = React.useState(window.innerWidth * 0.55)
  const [logContainerHeight, setLogContainerHeight] = React.useState(window.innerHeight * 0.4)
  const listRef = React.useRef() as any

  const handleResize = () => {
    setLogContainerWidth(window.innerWidth * 0.55)
    setLogContainerHeight(window.innerHeight * 0.4)
  }
  window.addEventListener('resize', handleResize)

  React.useEffect(() => {
    listRef.current.scrollToItem(logData.length - 1)
  }, [logData])

  const renderRow: React.FC<ListChildComponentProps> = ({ data, index, style }) => {
    const log = data.logData[index]
    return (
      <Grid item xs={12} style={style}>
        <div style={{ color: log.type === 'error' ? 'red' : 'black', fontSize: '12px' }}>
          {log.message}
        </div>
      </Grid>
    )
  }

  return (
    <>
      <Grid container direction='column' className={classes.LogContainer}>
        <FixedSizeList
          ref={listRef}
          height={logContainerHeight}
          width={logContainerwidth}
          itemSize={20}
          itemCount={logData.length}
          itemData={{ logData: logData }}
        >
          {renderRow}
        </FixedSizeList>
      </Grid>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    LogContainer: {
      border: 'solid 1px',
      borderColor: 'rgb(184, 184, 184)',
      borderRadius: 5,
      padding: '5px',
    }
  }))

export default LogComponent

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import AssignmentTurnedInRoundedIcon from '@material-ui/icons/AssignmentTurnedInRounded';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50vh',
  },
  paper: {
    margin: theme.spacing(8, 10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/* div>
            <h2>{props.title}</h2>
          <form onSubmit={props.newTask} onInput={props.input}>
            <input type="text" name="content" placeholder="Contenido.."/>
            <input type="date" name="date" placeholder="Fecha..."/>
            <button type="submit">Agregar tarea</button>
          </form>
</div>   */

function NuevaTarea(props){
  const classes = useStyles();
    return(
      <Grid container component="main" className={classes.root}>
            <Grid item xs={12} sm={8} md={12} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                      <Avatar className={classes.avatar}>
                          <AssignmentTurnedInRoundedIcon />
                      </Avatar>
                      <Typography component="h1" variant="h5">
                        {props.title}
                      </Typography>
                      <form className={classes.form} onSubmit={props.newTask} onInput={props.input}>
                          <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              id="content"
                              label="Tarea"
                              name="content"
                              autoComplete="content"
                              autoFocus
                          />
                          <TextField
                              type="date"
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              id="date"
                              label="Fecha"
                              name="date"
                              autoFocus
                          />
                          <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              className={classes.submit}
                          >
                           Agregar tarea
                          </Button>
                          <Button
                              onClick={props.logout}
                              fullWidth
                              variant="contained"
                              color="primary"
                              className={classes.submit}
                          >
                           Cerrar Sesión
                          </Button>
                      </form>
                </div>
            </Grid>
      </Grid>
    );
}

export default NuevaTarea;
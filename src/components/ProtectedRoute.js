import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { getToken } from './Common';

export const ProtectedRoute = ({component: Component, ...rest}) =>{
  return (
    <Route
        {...rest}
        render = {(props)=> getToken() ? <Component {...props} /> :
                    <Redirect to = {
                      {
                        pathname: '/sign_in',
                        state: { from: props.location }
                      }
                    }
                      />
                }
    />
  );
};

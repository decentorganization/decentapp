import React, {useCallback} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Account from './Account';
import OauthManager from './OauthManager';
import RouteRule from '../Routes/RouteRule';
import {useAsyncState} from "../redux/actions/useAsyncState";
import {StateProperty} from "../redux/reducers";
import {request} from "../requests";
import Invites from "./Invites";

function Settings() {
  const match = useRouteMatch();
  const profiles = useAsyncState(StateProperty.userProfile);
  useAsyncState(StateProperty.invitations, useCallback( async () => await request('invitation/', 'GET'),[]))

  const canManageOauth =
    profiles.data.currentProfile.profileType === 'hospitalOrg' &&
    profiles.data.currentProfile.admin;

  return (
    <>
      <Nav variant='tabs'>
        <Nav.Item>
          <LinkContainer to={`${match.path}/account`}>
            <Nav.Link eventKey='account'>Account</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        {profiles.data.currentProfile.admin &&
          <Nav.Item>
            <LinkContainer to={`${match.path}/invites`}>
              <Nav.Link eventKey='invites'>Outstanding Invites</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        }
        {canManageOauth &&
          <Nav.Item>
            <LinkContainer to={`${match.path}/oauth`}>
              <Nav.Link eventKey='oauth-apps'>OAuth Applications</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        }
      </Nav>

      <Row className='mt-4'>
        <Col>
          <Switch>
            <Route path={`${match.path}/account/:unknown`}>
              <Redirect to={`${match.path}/account`} />
            </Route>
            <Route path={`${match.path}/account`}>
              <Account />
            </Route>
            <Route path={`${match.path}/invites/:unknown`}>
              <Redirect to={`${match.path}/invites`} />
            </Route>
            <Route path={`${match.path}/invites`}>
              <Invites />
            </Route>

            <RouteRule
              path={`${match.path}/oauth`}
              rule={canManageOauth}
            >
              <OauthManager />
            </RouteRule>

            <Route path={match.path}>
              <Redirect to={`${match.path}/account`} />
            </Route>
          </Switch>
        </Col>
      </Row>
    </>
  );
}

export default Settings;

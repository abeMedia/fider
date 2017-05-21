import * as React from "react";
import * as moment from "moment";
import md5 = require("md5");
import { AxiosError, AxiosResponse } from "axios";
import { get, getCurrentUser } from "../storage";
import { User } from "../models";

export const Gravatar = (props: {email?: string}) => {
  const hash = props.email ? md5(props.email) : "";
  return <img className="ui avatar image" src={ "https://www.gravatar.com/avatar/" + hash } />;
};

export const MultiLineText = (props: {text?: string}) => {
  if (!props.text) {
    return <p></p>;
  }

  return <div>{props.text.split("\n").map((item, i) =>
   <span>{item}<br/></span>
  )}</div>;
};

export const DisplayError = (props: {error?: Error}) => {
  if (!props.error) {
    return <div></div>;
  }

  return <div className="ui negative message">
            <div className="header">
              Oops, an error ocurred...
            </div>
            <p>{ props.error.message }</p>
         </div>;
};

export const EnvironmentInfo = () => {
  const settings = get<any>("settings");
  if (settings.Environment.toLowerCase() !== "production") {
    return <div className="ui mini negative message no-border no-margin">
                Env: { settings.Environment } |
                Compiler: { settings.Compiler } |
                Version: { settings.Version } |
                BuildTime: { settings.BuildTime }
            </div>;
  }
  return <div/>;
};

export const IdeaStatusRibbon = (props: { status: number }) => {
  const statusText =  props.status === 1 ? "Started" :
                      props.status === 2 ? "Completed" :
                      props.status === 3 ? "Declined" : "Unknown";
  const color =  props.status === 1 ? "blue" :
                 props.status === 2 ? "green" :
                 props.status === 3 ? "red" : "black";

  return <span className={`ui ribbon label ${color}`}>{ statusText }</span>;
};

interface IdeaResponseProps {
  status: number;
  user: User;
  response?: string;
  createdOn?: Date;
}

export const IdeaResponse = (props: IdeaResponseProps): JSX.Element => {
  if (props.createdOn) {
    return <div className="fdr-response item ui raised segment">
            <IdeaStatusRibbon status={props.status} />
            <div className="info">
              <Gravatar email={props.user.email}/> <u>{props.user.name}</u>
              <span title={props.createdOn.toString()}>{ moment(props.createdOn).fromNow() }</span>
            </div>
            <div className="content">
              <MultiLineText text={ props.response } />
            </div>
          </div>;
  }
  return <div/>;
};
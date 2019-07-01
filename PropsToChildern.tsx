import * as React from 'react';

type Props = {
    props:{[key:string]:any};
    children?:React.ReactNode;
};

export const PropsToChildren = (props:Props) =>
    <Children props={props.props}>
        {props.children}
    </Children>;

const Children = props => {
    const mapper = child =>
        React.cloneElement(child, props.props);

    const children = React.Children.map(props.children, mapper);

    return <>{children}</>;
};
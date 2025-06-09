import DiceBox from "../pages/DiceBox";
import { Route, Switch } from "wouter";

/**
* The router is imported in app.jsx
*
* Our site just has two routes in it–Home and About
* Each one is defined as a component in /pages
* We use Switch to only render one route at a time https://github.com/molefrog/wouter#switch-
*/

export default () => (
    <Switch>
        <Route path="/:game">{(params) => DiceBox(params.game)()}</Route>
        <Route path="/dicebox/:game">{(params) => DiceBox(params.game)()}</Route>
        <Route path="*">{DiceBox('d20')()}</Route>
        <Route path="/dicebox/*">{DiceBox('d20')()}</Route>
    </Switch>
);
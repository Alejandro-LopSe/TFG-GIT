import { PageProps } from "$fresh/server.ts";
import { Header_top } from "../components/headers/Header_top.tsx";
import { Toolbar } from "../components/headers/Toolbar.tsx";
import { MyState } from "../types.ts";

export default function Layout(props: PageProps<unknown, MyState>) {
  if (props.url.pathname === "/login") {
    return <props.Component />;
  } else {
    return (
      <>
        <Header_top state={props.state}></Header_top>
        <div class="flex flex-row space-x-1 space-y-1">
          <Toolbar state={props.state}></Toolbar>
          <props.Component></props.Component>
        </div>
      </>
    );
  }
}

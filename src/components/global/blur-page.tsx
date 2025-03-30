import React from "react";

type Props = {
    children: React.ReactNode
}


const BlurPage = ({children} : Props) => {
    return <div id="blur-page"
        className="h-screen overflow-scroll bg-white backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black  mx-auto pt-24 p-4"
    >{children}</div>;
}
 
export default BlurPage;
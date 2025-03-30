import Link from 'next/link'
import React from 'react';

type Props = {}


const Unauth = (props: Props) => {
    return ( 
        <div className='p-4 text-cent h-screen w-screen flex justify-center items-center flex-col'>
            <h1 className='text-3xl md:text-6xl'>Unauthorized access!</h1>
            <p>Please contact support or you business owner to get access</p>
            <Link href='/' className='mt-4 bg-primary p-2'>Back to home</Link>
        </div>
     );
}
 
export default Unauth;
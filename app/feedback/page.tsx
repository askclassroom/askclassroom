'use client'

import React from 'react'
import FeedbackModal from '@/components/FeedbackModal'

const page = () => {
    const [open, setOpen] = React.useState(true);
    return (
        <div>
            <FeedbackModal open={open} setOpen={setOpen} />
        </div>
    )
}

export default page
import React from 'react';
import { useState } from 'react';

export default function ErrorPage({ errorMessage }) {
    const [error, setError] = useState(errorMessage || '')
    return (
        <div className="error-page">
            <h1>Oops, something went wrong</h1>
            <h2>Page Not Found</h2>
            {error && <h3>Error: {error}</h3>}
        </div>
    )

}
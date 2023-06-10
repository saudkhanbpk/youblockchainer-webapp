import React, { useEffect, useState } from 'react'
import CardExOrg from '../components/card/CardExOrg'
import { Grid, InputAdornment, TextField } from '@mui/material'
import { getUsers } from '../services/userServices'
import FuzzySearch from 'fuzzy-search'
import { textField } from '../theme/CssMy'
import { Icon } from '@iconify/react'

export default function SearchExperts() {
    const [experts, setExperts] = useState([])
    const [search, setSearch] = useState('')
    const [showExperts, setShowExperts] = useState([])

    useEffect(() => {
        const func = async () => {
            await getUsers()
                .then((res) => {
                    console.log(res.data)
                    setExperts(res.data)
                    setShowExperts(res.data)
                }).catch((e) => console.log(e))
        }
        func()
    }, [])

    const searcher = new FuzzySearch(experts, ['username', 'skills'], {
        caseSensitive: false,
    });

    useEffect(() => {
        const res = searcher.search(search)
        setShowExperts(res)
        console.log(res)
    }, [search])

    return (
        <>
            <TextField value={search} sx={textField} InputProps={{
                endAdornment: <InputAdornment position="end"><Icon icon="ic:round-search" width={22} height={22} /></InputAdornment>,
            }} placeholder='Search Experts By Name or Skills' onChange={(e) => setSearch(e.target.value)} />
            <Grid container spacing={3}>
                {
                    showExperts.map((exp, index) => {
                        return <Grid key={index} item md={3} sm={4} xs={12}>
                            <CardExOrg exp={exp} />
                        </Grid>
                    })
                }

            </Grid>
        </>
    )
}

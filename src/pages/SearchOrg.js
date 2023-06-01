import React, { useEffect, useState } from 'react'
import CardExOrg from '../components/card/CardExOrg'
import { Grid, InputAdornment, TextField } from '@mui/material'
import FuzzySearch from 'fuzzy-search'
import { textField } from '../theme/CssMy'
import { Icon } from '@iconify/react'
import { getBrands } from '../services/brandsApi'

export default function SearchOrg() {
    const [orgs, setOrgs] = useState([])
    const [search, setSearch] = useState('')
    const [showOrgs, setShowOrgs] = useState([])

    useEffect(() => {
        const func = async () => {
            await getBrands()
                .then((res) => {
                    console.log(res.data)
                    setOrgs(res.data)
                    setShowOrgs(res.data)
                }).catch((e) => console.log(e))
        }
        func()
    }, [])

    const searcher = new FuzzySearch(orgs, ['username', 'skills'], {
        caseSensitive: false,
    });

    useEffect(() => {
        const res = searcher.search(search)
        setShowOrgs(res)
        console.log(res)
    }, [search])

    return (
        <>
            <TextField value={search} sx={textField} InputProps={{
                endAdornment: <InputAdornment position="end"><Icon icon="ic:round-search" width={22} height={22} /></InputAdornment>,
            }} placeholder='Search Experts By Name or Skills' onChange={(e) => setSearch(e.target.value)} />
            <Grid container spacing={3}>
                {
                    showOrgs.map((exp, index) => {
                        return <Grid key={index} item md={3} sm={4} xs={2}>
                            <CardExOrg exp={exp} org={true} />
                        </Grid>
                    })
                }

            </Grid>
        </>
    )
}

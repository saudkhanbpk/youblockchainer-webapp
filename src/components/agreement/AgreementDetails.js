import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { getExpertById } from '../../services/userServices'
import { Accordion, AccordionDetails, Paper, AccordionSummary, Alert, Avatar, AvatarGroup, Badge, Box, Button, CardContent, Grid, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, CircularProgress, CardMedia, Rating } from '@mui/material'
import { bold_name, btn_connect, btn_hire, card, circularImage, circularprog, circularprog_hire, df_jc_ac, df_jfs_ac, ptag, textField } from '../../theme/CssMy'
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import moment from 'moment'
import Agreement from '../../abis/Agreement.json'
import Web3 from 'web3'
import { contractAddress, forwarderAddress } from '../../Constants'
import AddMilestoneModal from './AddMilestoneModal'
import Forwarder from '../../abis/Forwarder.json'
import AskGPT from '../../abis/AskGPT.json'
import { Icon } from '@iconify/react'
import { endContract, fundMilestone, grantRefundRequest, payMilestone, raiseRefundRequest, requestPayment, updateAgreement, updateRefundRequest } from '../../services/agreement'
import { executeMetaTx } from '../../services/helper'
import ReviewModal from './ReviewModal'
// import { userInfo } from 'os'
import errorHandler from '../toasts/errorHandler'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#3770FFab',
        color: theme.palette.common.white,
        width: 'auto',
        fontWeight: 'bold',
        lineHeight: '0.5rem'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        lineHeight: '0.5rem'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        lineHeight: '0.5rem'
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
        lineHeight: '0.5rem'
    },
}));

export default function AgreementDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const id = params.id
    const location = useLocation()
    const agreement = location.state
    console.log(agreement, id)
    const [u1, setU1] = useState(null)
    const [u2, setU2] = useState(null)
    const [open, setOpen] = useState('');
    const [milestones, setMilestones] = useState([])
    const [feeRate, setFeeRate] = useState('')
    const [contract1FC, setcontract1FC] = useState(null)
    const [contract2MC, setcontract2MC] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [escrowed, setEscrowed] = useState(0)
    const [idclicked, setIdclicked] = useState('')
    const [isAllPaymentResolved, setIsAllPaymentResolved] = useState(false)
    const [msLoading, setMsLoading] = useState(false)
    const [refundamt, setRefundamt] = useState('')
    const [changeTxt, setChangeTxt] = useState('Refund')
    const [rffLoading, setRffLoading] = useState(false)
    const [payLoading, setPayLoading] = useState(false)
    const [clickedreq, setClickedreq] = useState('')
    const [fundLoading, setFundLoading] = useState(false)
    const [value, setValue] = useState(0)
    const [rev, setRev] = useState('')
    const [grantreqLoading, setGrantreqLoading] = useState([])
    const [payreqLoading, setPayreqLoading] = useState([])
    const [openReview, setOpenReview] = useState(false)
    const [revLoading, setRevLoading] = useState(false)
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [agreementContract, setAgreementContract] = useState(null)

    useEffect(() => {
        let provider = window.web3;
        const web3 = new Web3(provider);
        setcontract1FC(new web3.eth.Contract(Forwarder, forwarderAddress))
        setcontract2MC(new web3.eth.Contract(AskGPT, contractAddress))
        setAgreementContract(new web3.eth.Contract(Agreement, agreement.contractAddress));
    }, [])

    useEffect(() => {
        const func = async () => {
            setU1(agreement.user1)
            setU2(agreement.user2)
            console.log(u1, u2)
        }
        func()
    }, [])




    const getAllMilestones = async () => {
        setMsLoading(true);
        try {
            let summ = await agreementContract.methods.getAgreementSummary().call();
            //console.log(fee);
            setFeeRate(summ['10']);
            setEscrowed(summ['6']);
            let res = await agreementContract.methods.getAllMilestones().call();
            let reqs = await agreementContract.methods.getAllRefundRequests().call();

            // console.log(res);
            setIsAllPaymentResolved(!res.find(i => !i[6])); //find paid false and if found set resolved false
            setMilestones(
                res
                    .filter(i => i[0] !== '0')
                    .map(i => {
                        return [...i, reqs.filter(j => j[1] === i[0])];
                    }),
            );
        } catch (error) {
            console.log('Error in getting mileStones:- ', error.message);
        }
        setMsLoading(false);
    };

    useEffect(() => {
        if (agreementContract) {
            getAllMilestones();
        }
    }, [agreementContract, open]);


    const fund = async (id, amount) => {
        setFundLoading(true)
        if (await fundMilestone(id, agreementContract, u1.walletAddress, (Number(amount) + (amount * feeRate) / 1000))) {
            getAllMilestones()
        }
        setFundLoading(false)
    }

    const refund = async (id, amount) => {
        setRffLoading(true)
        if (await raiseRefundRequest(id, Web3.utils.toWei(amount), agreementContract, executeMetaTx, agreement.contractAddress, contract1FC)) {
            getAllMilestones()
            setRefundamt('')
        }
        setRffLoading(false)
    }

    const updateRefund = async (amount) => {
        setRffLoading(true)
        if (await updateRefundRequest(clickedreq, Web3.utils.toWei(amount), agreementContract, executeMetaTx, agreement.contractAddress, contract1FC)) {
            setRefundamt('')
            setChangeTxt('Refund')
            getAllMilestones()
        }
        setRffLoading(false)
    }

    const payMs = async (id) => {
        setPayLoading(true)
        if (await payMilestone(id, agreementContract, executeMetaTx, agreement.contractAddress, contract1FC)) {
            getAllMilestones()
        }
        setPayLoading(false)
    }

    const grantReq = async (id, index) => {
        setGrantreqLoading((prevState) => {
            const updatedLoading = [...prevState];
            updatedLoading[index] = true;
            return updatedLoading;
        })
        if (await grantRefundRequest(id, agreementContract, executeMetaTx, agreement.contractAddress, contract1FC)) {
            getAllMilestones()
        }
        setGrantreqLoading((prevState) => {
            const updatedLoading = [...prevState];
            updatedLoading[index] = false;
            return updatedLoading;
        })
    }

    const reqPay = async (id, index) => {
        setPayreqLoading((prevState) => {
            const updatedLoading = [...prevState];
            updatedLoading[index] = true;
            return updatedLoading;
        })
        console.log(id)
        if (await requestPayment(id, agreementContract, executeMetaTx, agreement.contractAddress, contract1FC)) {
            getAllMilestones()
        }
        setPayreqLoading((prevState) => {
            const updatedLoading = [...prevState];
            updatedLoading[index] = false;
            return updatedLoading;
        })
    }

    const endCon = async () => {
        if (await endContract(agreementContract, executeMetaTx, agreement.contractAddress, agreement._id, contract1FC)) {
            setOpenReview(true)
            // navigate('/profile')
        }
    }

    const clicker = async () => {
        setRevLoading(true)
        if (await updateAgreement(agreement._id, u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id ?
            { reviewForU2: rev, ratingForU2: value } :
            { reviewForU1: rev, ratingForU1: value })) {
            navigate('/profile')
        }
        setRevLoading(false)
    }

    console.log(milestones)

    return (
        <>
            {u1 && u2 && <>
                <Box sx={{ padding: { md: '2% 10%', xs: '2%' }, display: 'flex', justifyContent: 'center' }}>
                    <AvatarGroup>
                        <Badge badgeContent={'Creator'} color="primary" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}>
                            <Avatar src={u1.profileImage} sx={{ width: '8rem', height: '8rem', border: '3px solid #3770FF !important' }} />
                        </Badge>
                        <Badge badgeContent={`Getter`} color="primary" anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}>
                            <Avatar src={u2.profileImage} sx={{ width: '8rem', height: '8rem', border: '3px solid #3770FF !important' }} />
                        </Badge>
                    </AvatarGroup>
                </Box>
                <Box sx={{ display: 'flex', padding: { md: '2% 20%', xs: '2%' }, flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant='h5' sx={{ ...bold_name, textAlign: 'center', margin: '0' }}>{agreement.name.toUpperCase()}</Typography>
                    <p style={{ ...ptag, textAlign: 'center' }}>{moment.unix(agreement.startsAt).format('MMMM DD, YY')} - {agreement?.endsAt ? moment.unix(agreement.endsAt).format('MMMM DD, YY') : 'Present'}</p>
                    {!agreement.endsAt ? u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id && isAllPaymentResolved && <Box sx={df_jc_ac}>
                        <Button onClick={endCon} sx={{ color: 'red', width: 'auto', textTransform: 'none', border: '2px solid red' }}>End contract</Button>
                    </Box> : <Box sx={df_jc_ac}><Typography sx={{ ...ptag, fontWeight: 'bold', color: 'red' }}>Agreement ended</Typography> </Box>}
                    <CardContent sx={{ marginTop: '5%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant='h6' sx={{ ...bold_name }}>Milestones</Typography>
                            {u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id && <Button onClick={() => setOpen('create')} size='small' sx={{ ...btn_connect, width: 'auto' }}>+ Add milestone</Button>}
                        </Box>
                        {
                            agreement?.endsAt ? milestones.map((ms, index) => {
                                return <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)} sx={{ width: '100%', marginTop: '2%', boxShadow: '0px 1px 26px rgba(94, 99, 116, 0.05)', border: 'none' }} >
                                    <AccordionSummary
                                        sx={{
                                            display: 'flex', justifyContent: 'space-between', width: '100%', '& .MuiAccordionSummary-content': { justifyContent: 'space-between' },
                                            '& .MuiAccordion-root': { backgroundColor: '#FFC48B4c !important', borderRadius: '15px', border: 'none' }
                                        }}
                                    >
                                        <Grid container sx={{ display: 'flex' }}>
                                            <Grid item md={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Icon color='#3770FF' width={20} icon="teenyicons:tick-circle-solid" />
                                            </Grid>
                                            <Grid item md={7} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                                <Typography sx={{ ...bold_name }} >{ms[1]}</Typography>
                                                {!(expanded === `panel${index}`) && <p style={ptag}>{ms[3].slice(0, 15)}</p>}
                                            </Grid>
                                            <Grid item md={4.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                                <p style={{ ...ptag, fontSize: '11px' }}>
                                                    {Web3.utils.fromWei(ms[2])} ETH {' '}
                                                    {u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id
                                                        ? '\n + ' +
                                                        Web3.utils.fromWei(((ms[2] * feeRate) / 1000).toString()) +
                                                        ` ETH (${feeRate / 10}% fee )`
                                                        : ''}
                                                </p>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ paddingLeft: '11%', border: 'none' }}>
                                        {ms[5] && <Alert severity="warning" sx={{ marginBottom: '5%' }}>Payment request is made - clear it as soon as possible!</Alert>}
                                        <p style={{ ...ptag, wordWrap: 'break-word' }}>{ms[3]}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5%', alignItems: 'center' }}>

                                            <div style={{ width: '100%' }}>
                                                {ms[7].length ? <TableContainer sx={{ marginTop: '5%' }} component={Paper}>
                                                    <Table aria-label="customized table">
                                                        <TableHead >
                                                            <TableRow>
                                                                <StyledTableCell>Amount (in ETH)</StyledTableCell>
                                                                <StyledTableCell>Status</StyledTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                ms[7].map((req) => {
                                                                    return <StyledTableRow key={req[0]}>
                                                                        <StyledTableCell>{Web3.utils.fromWei(req[2])}</StyledTableCell>
                                                                        <StyledTableCell>Processed</StyledTableCell>

                                                                    </StyledTableRow>
                                                                })
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer> : ""}
                                            </div>

{/* 
                                            {
                                                !(u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id) && <>
                                                    {ms[7].length ? <TableContainer sx={{ marginTop: '5%' }} component={Paper}>
                                                        <Table aria-label="customized table">
                                                            <TableHead >
                                                                <TableRow>
                                                                    <StyledTableCell>Amount (in ETH)</StyledTableCell>
                                                                    <StyledTableCell align='right'>Requested</StyledTableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    ms[7].map((req, i) => {
                                                                        return <StyledTableRow key={req[0]}>
                                                                            <StyledTableCell>{Web3.utils.fromWei(req[2])}</StyledTableCell>
                                                                            <StyledTableCell align='right'> Processed </StyledTableCell>

                                                                        </StyledTableRow>
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer> : ""}
                                                </>
                                            } */}

                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            }) : msLoading ? "...loading" : milestones.map((ms, index) => {
                                return <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)} sx={{ width: '100%', marginTop: '2%', boxShadow: '0px 1px 26px rgba(94, 99, 116, 0.05)', border: 'none' }} >
                                    <AccordionSummary
                                        sx={{
                                            display: 'flex', justifyContent: 'space-between', width: '100%', '& .MuiAccordionSummary-content': { justifyContent: 'space-between' },
                                            '& .MuiAccordion-root': { backgroundColor: '#FFC48B4c !important', borderRadius: '15px', border: 'none' }
                                        }}
                                    >
                                        <Grid container sx={{ display: 'flex' }}>
                                            <Grid item md={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                                {ms[6] ? <Icon color='#3770FF' width={20} icon="teenyicons:tick-circle-solid" /> : <Icon color='#6A707F5c' icon="teenyicons:tick-circle-outline" />}
                                            </Grid>
                                            <Grid item md={7} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                                <Typography sx={{ ...bold_name }} >{ms[1]}</Typography>
                                                {!(expanded === `panel${index}`) && <p style={ptag}>{ms[3].slice(0, 15)}</p>}
                                            </Grid>
                                            <Grid item md={4.5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                                <p style={{ ...ptag, fontSize: '11px' }}>
                                                    {Web3.utils.fromWei(ms[2])} ETH {' '}
                                                    {u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id
                                                        ? '\n + ' +
                                                        Web3.utils.fromWei(((ms[2] * feeRate) / 1000).toString()) +
                                                        ` ETH (${feeRate / 10}% fee )`
                                                        : ''}
                                                </p>
                                                {
                                                    !(u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id) && !ms[6] &&
                                                    <Box sx={{ marginLeft: '5%', display: 'flex' }}>
                                                        {payreqLoading[index] ? <CircularProgress size={30} sx={circularprog} /> : <Button sixe='small' onClick={() => reqPay(ms[0], index)} sx={{ ...btn_connect, fontSize: '11px' }}>Request to pay</Button>}
                                                    </Box>
                                                }
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ paddingLeft: '11%', border: 'none' }}>
                                        {ms[5] && <Alert severity="warning" sx={{ marginBottom: '5%' }}>Payment request is made - clear it as soon as possible!</Alert>}
                                        <p style={{ ...ptag, wordWrap: 'break-word' }}>{ms[3]}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5%', alignItems: 'center' }}>
                                            {
                                                u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id && (ms[4] ?
                                                    <div style={{ width: '100%' }}>
                                                        {!ms[6] && <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                            <div>
                                                                <TextField size='small' value={refundamt} onChange={(e) => setRefundamt(e.target.value)} placeholder='Amount (in ETH)' />
                                                                {rffLoading ? <CircularProgress size={30} sx={circularprog} /> : <Button onClick={() => changeTxt === 'Refund' ? refund(ms[0], refundamt) : updateRefund(refundamt)} size='small' sx={{ ...btn_connect, height: '100%', width: 'auto', padding: '2px 20px' }}>{changeTxt}</Button>}
                                                            </div>
                                                            {payLoading ? <CircularProgress size={30} sx={circularprog_hire} /> : <Button size='small' onClick={() => payMs(ms[0])} sx={{ ...btn_hire, width: 'auto' }}>{'Pay'}</Button>}
                                                        </Box>}
                                                        {ms[7].length ? <TableContainer sx={{ marginTop: '5%' }} component={Paper}>
                                                            <Table aria-label="customized table">
                                                                <TableHead >
                                                                    <TableRow>
                                                                        <StyledTableCell>Amount (in ETH)</StyledTableCell>
                                                                        <StyledTableCell>Edit</StyledTableCell>
                                                                        <StyledTableCell>Status</StyledTableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        ms[7].map((req) => {
                                                                            return <StyledTableRow key={req[0]}>
                                                                                <StyledTableCell>{Web3.utils.fromWei(req[2])}</StyledTableCell>
                                                                                <StyledTableCell><Icon onClick={() => {
                                                                                    if (req[3]) {
                                                                                        errorHandler("Request already processed")
                                                                                    } else {
                                                                                        setRefundamt(Web3.utils.fromWei(req[2]))
                                                                                        setChangeTxt('Edit')
                                                                                        setClickedreq(req[0])
                                                                                    }
                                                                                }} icon="fluent:edit-16-filled" style={{ cursor: 'pointer' }} width={22} height={22} color="#6A707F" /></StyledTableCell>
                                                                                <StyledTableCell>{req[3] ? 'Processed' : 'Requested'}</StyledTableCell>

                                                                            </StyledTableRow>
                                                                        })
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer> : ""}
                                                    </div>
                                                    : fundLoading ? <CircularProgress size={30} sx={circularprog_hire} /> : <Button size='small' onClick={() => fund(ms[0], ms[2])} sx={{ ...btn_hire, width: 'auto' }}>{'Fund'}</Button>)
                                            }

                                            {
                                                !(u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id) && <>
                                                    {ms[7].length ? <TableContainer sx={{ marginTop: '5%' }} component={Paper}>
                                                        <Table aria-label="customized table">
                                                            <TableHead >
                                                                <TableRow>
                                                                    <StyledTableCell>Amount (in ETH)</StyledTableCell>
                                                                    <StyledTableCell align='right'>Requested</StyledTableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    ms[7].map((req, i) => {
                                                                        return <StyledTableRow key={req[0]}>
                                                                            <StyledTableCell>{Web3.utils.fromWei(req[2])}</StyledTableCell>
                                                                            <StyledTableCell align='right'>{req[3] ? 'Processed' : grantreqLoading[i] ? <CircularProgress size={30} sx={circularprog} /> : <Button onClick={() => grantReq(req[0], i)} size='small' sx={{ ...btn_connect, width: 'auto' }}>
                                                                                Grant Request
                                                                            </Button>}</StyledTableCell>

                                                                        </StyledTableRow>
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer> : ""}
                                                </>
                                            }
                                            {
                                                u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id && !ms[4] && <Grid container spacing={3}>
                                                    <Grid item md={9}></Grid>
                                                    <Grid item md={1.5}>
                                                        <Icon onClick={() => {
                                                            setIdclicked(ms[0])
                                                            setOpen('edit')
                                                        }} icon="fluent:edit-16-filled" style={{ cursor: 'pointer' }} width={22} height={22} color="#6A707F" />
                                                    </Grid>
                                                    <Grid item maxWidth={1.5}>
                                                        <Icon onClick={() => {
                                                            setIdclicked(ms[0])
                                                            setOpen('delete')
                                                        }} icon="fluent:delete-32-filled" style={{ cursor: 'pointer' }} width={22} height={22} color="#6A707F" />
                                                    </Grid>
                                                </Grid>
                                            }
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            })

                        }
                    </CardContent>
                </Box>
                {
                    agreement.endsAt && u1._id !== (JSON.parse(localStorage.getItem('ybUser')))._id && <Box sx={{ ...df_jfs_ac, flexDirection: 'column', padding: { md: '2% 20%', xs: '2%' } }}>
                        <CardContent sx={{ ...card, display: 'flex', width: '100%' }}>
                            <Avatar src={u1.profileImage} />
                            <Box sx={{ marginLeft: '2%' }}>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px' }}>Review for you by {u1.username}</Typography>
                                <p style={ptag}>{agreement.reviewForU2}</p>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5%' }}>Rating</Typography>
                                <Rating size="small" value={agreement.ratingForU2} readOnly />
                            </Box>
                        </CardContent>
                        {agreement.reviewForU1 ? <CardContent sx={{ ...card, marginTop: '5%', display: 'flex', width: '100%' }}>
                            <Avatar src={u2.profileImage} />
                            <Box sx={{ marginLeft: '2%' }}>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px' }}>Review</Typography>
                                <p style={ptag}>{agreement.reviewForU1}</p>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5%' }}>Rating</Typography>
                                <Rating size="small" value={agreement.ratingForU1} readOnly />
                            </Box>
                        </CardContent> : <CardContent sx={{ ...card, marginTop:'5%', display: 'flex', width: '100%' }}>
                            <Avatar src={u2.profileImage} />
                            <Box sx={{ marginLeft: '2%', width: '100%' }}>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px' }}>Review</Typography>
                                <TextField value={rev} onChange={(e) => setRev(e.target.value)} multiline rows={2} placeholder={`How was your experience working with ${u2.username} ?`} style={{ ...textField, width: '100%' }} />
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5%' }}>Rating</Typography>
                                <Rating
                                    name="simple-controlled"
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                />
                                {
                                    revLoading ? <CircularProgress size='small' sx={circularprog} /> : <Button onClick={clicker} sx={{ ...btn_connect, width: 'auto' }}>Send</Button>
                                }
                            </Box>
                        </CardContent>}
                    </Box>
                }
                {
                    agreement.endsAt && u1._id === (JSON.parse(localStorage.getItem('ybUser')))._id && <Box sx={{ ...df_jfs_ac, flexDirection: 'column', padding: { md: '2% 20%', xs: '2%' } }}>
                        <CardContent sx={{ ...card, display: 'flex', width: '100%' }}>
                            <Avatar src={u1.profileImage} />
                            <Box sx={{ marginLeft: '2%' }}>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px' }}>Review</Typography>
                                <p style={ptag}>{agreement.reviewForU2}</p>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5%' }}>Rating</Typography>
                                <Rating size="small" value={agreement.ratingForU2} readOnly />
                            </Box>
                        </CardContent>
                        {agreement.reviewForU1 && <CardContent sx={{ ...card, marginTop: '5%', display: 'flex', width: '100%' }}>
                            <Avatar src={u2.profileImage} />
                            <Box sx={{ marginLeft: '2%' }}>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px' }}>Review for you from {u2.username}</Typography>
                                <p style={ptag}>{agreement.reviewForU1}</p>
                                <Typography component='legend' sx={{ fontWeight: 'bold', fontSize: '14px', marginTop: '5%' }}>Rating</Typography>
                                <Rating size="small" value={agreement.ratingForU1} readOnly />
                            </Box>
                        </CardContent>}
                    </Box>
                }
                <ReviewModal open={openReview} setOpen={setOpenReview} u1={u1} u2={u2} id={agreement._id} />
            </>}
            <AddMilestoneModal open={open} setMsLoading={setMsLoading} setOpen={setOpen} idclicked={idclicked} agreementContract={agreementContract} agreementAddr={agreement.contractAddress} getMilestone={getAllMilestones} />
        </>
    )
}

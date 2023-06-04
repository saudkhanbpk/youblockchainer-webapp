import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AgreementCard from '../card/AgreementCard';
import { bold_name } from '../../theme/CssMy';
import { Grid } from '@mui/material';
import EmptyState from '../loadingoremptystate/EmptyState';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { saveAs } from 'file-saver';
import { updateMe } from '../../services/userServices';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs({ details, setDetails }) {
    const [value, setValue] = React.useState(0);
    const { setUser } = React.useContext(ybcontext)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab sx={{ textTransform: 'none', fontWeight: 'bold' }} label="Saved scripts" {...a11yProps(0)} />
                    <Tab sx={{ textTransform: 'none', fontWeight: 'bold' }} label="All agreements" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box>
                    {details?.scripts.length !== 0 && <>
                        {/* <Typography sx={{ ...bold_name, color: '#3770FF', paddingBottom: '2%', }}>Saved scripts</Typography> */}
                        <Grid spacing={2} container>
                            {
                                details.scripts.map((scri, i) => {
                                    return <Grid item md={4} style={{ width: '200px', height: '230px', overflow: 'hidden' }}>
                                        <FileDownloadIcon onClick={() => saveAs(scri, `script${i}`)} sx={{ zIndex: 1000, cursor: 'pointer', position: 'absolute', padding: '4px', fontSize: '20px', backgroundColor: 'rgba(164, 163, 164, 0.4)', boxShadow: 'inset 19.2333px -19.2333px 19.2333px rgba(124, 124, 124, 0.1), inset -19.2333px 19.2333px 19.2333px rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(19.2333px)', color: 'white', borderRadius: '50%' }} />
                                        <DeleteIcon onClick={async () => {
                                            let user = JSON.parse(localStorage.getItem('ybUser')).scripts
                                            let updatedScri = user.filter((l) => l !== scri)
                                            let res2 = await updateMe({ scripts: [...updatedScri] })
                                            localStorage.setItem('ybUser', JSON.stringify(res2.data))
                                            setUser(res2.data)
                                            setDetails(res2.data)
                                            successHandler('Script deleted successfully')
                                        }} sx={{ zIndex: 1000, cursor: 'pointer', position: 'absolute', padding: '4px', marginLeft: '30px', fontSize: '20px', backgroundColor: 'rgba(164, 163, 164, 0.4)', boxShadow: 'inset 19.2333px -19.2333px 19.2333px rgba(124, 124, 124, 0.1), inset -19.2333px 19.2333px 19.2333px rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(19.2333px)', color: 'white', borderRadius: '50%' }} />
                                        <iframe
                                            src={`${scri}#toolbar=0&navpanes=0`}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none', overflow: 'hidden' }}
                                        />
                                    </Grid>
                                })
                            }

                        </Grid>
                    </>}
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Box>
                    {/* <Typography sx={{ ...bold_name, color: '#3770FF', paddingBottom: '2%', }}>All agreements</Typography> */}

                    {details.agreements.length !== 0 ? <Grid container rowSpacing={3}>
                        {
                            details.agreements.map((agreement) => {
                                return <Grid item md={12}>
                                    <AgreementCard agreement={agreement} />
                                </Grid>
                            })
                        }
                    </Grid> : <EmptyState text='Nothing to show' size='20rem' />}
                </Box>
            </TabPanel>
        </Box>
    );
}
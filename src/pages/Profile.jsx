import {getAuth, updateProfile} from 'firebase/auth'
import {useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {db} from '../firebase.config'
import {updateDoc, doc, collection, getDocs, query, where, orderBy,
deleteDoc} from 'firebase/firestore'
import {toast} from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


function Profile() {
    const auth = getAuth()
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setformData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const {name, email} = formData

    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid),
                        orderBy('timestamp', 'desc'))
            
            const querySnap = await getDocs(q)
            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    const onChange = (e) => {
        setformData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }
    const onSubmit = async () => {
        try {
            if (auth.currentUser.name !== name) {
                //update dispaly name in fb
                updateProfile(auth.currentUser, {
                    displayName: name
                })
            }

            // update in firestore
            const userRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(userRef, {
                name
            })
        } catch (e) {
            toast.error('Could not update profile details')
        }
    }
    
    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
        await deleteDoc(doc(db, 'listings', listingId))
        }

        const updateListings = listings.filter((listing) => listing.id !== listingId)
        setListings(updateListings)
        toast.success('Successfully deleted listing')
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile </p>
                <button type='button' className='logOut' onClick={onLogout}>
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => (!prevState))
                    }}>
                        {changeDetails ? 'done': 'change'}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} 
                        value={name} onChange={onChange} />
                        <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} 
                        value={email} onChange={onChange} />
                    </form>
                </div>

                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt='home' />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt='arrow right' />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} 
                                onDelete={() => onDelete(listing.id)}
                                onEdit={() => onEdit(listing.id)}/>
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}

export default Profile

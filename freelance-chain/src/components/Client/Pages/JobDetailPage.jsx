// JobDetailPage.js
import SubmitBidForm from '../../Freelancer/Pages/SubmitBidForm';    
import JobBidsList from './JobBidsList';

const JobDetailPage = () => {
  const { user } = useAuth(); // Your auth context
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  // Fetch job details...

  return (
    <div>
      {/* Job details rendering... */}
      
      {user?.role === 'freelancer' && job?.status === 'open' ? (
        <SubmitBidForm jobId={jobId} />
      ) : user?.role === 'client' && job?.client === user.id ? (
        <JobBidsList jobId={jobId} />
      ) : null}
    </div>
  );
};
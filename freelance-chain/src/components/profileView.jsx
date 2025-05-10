export default function ProfileView({ profile, onEdit }) {
    return (
      <div className="bg-white shadow rounded p-4">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Bio:</strong> {profile.bio}</p>
        <p><strong>Wallet:</strong> {profile.walletAddress}</p>
        <button onClick={onEdit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
      </div>
    );
  }
  
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Notification from '../Notification';

const SignUp = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // ... existing signup logic ...

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (!error) {
      setShowNotification(true);
    }
  };

  return (
    <>
      {/* Your existing signup form */}
      {showNotification && (
        <Notification
          message="Please check your email to verify your account!"
          type="info"
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default SignUp;
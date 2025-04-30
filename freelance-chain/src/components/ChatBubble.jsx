// import React from 'react';
// import { cn } from '../lib/utils';
// import { format } from 'date-fns';

// const ChatBubble = ({
//   message,
//   timestamp,
//   isCurrentUser,
//   status = 'sent', 
//   className,
// }) => {
//   const time = new Date(timestamp);
//   const formattedTime = format(time, 'h:mm a');

//   return (
//     <div className={cn(
//       "flex flex-col mb-4",
//       isCurrentUser ? "items-end" : "items-start",
//       className
//     )}>
//       <div className={isCurrentUser ? "chat-bubble-sent" : "chat-bubble-received"}>
//         <p className="whitespace-pre-wrap break-words">{message}</p>
//       </div>

//       <div className="flex items-center mt-1">
//         <span className="text-xs text-gray-500 mx-2">{formattedTime}</span>

//         {isCurrentUser && (
//           <span className="text-xs text-gray-500">
//             {status === 'read' ? (
//               <span className="text-blue-500">✓✓</span>
//             ) : status === 'delivered' ? (
//               <span>✓✓</span>
//             ) : (
//               <span>✓</span>
//             )}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatBubble;

import React from 'react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const ChatBubble = ({
  message,
  timestamp,
  isCurrentUser,
  status = 'sent',
  className,
}) => {
  const time = new Date(timestamp);
  const formattedTime = format(time, 'h:mm a');

  return (
    <div className={cn(
      "flex flex-col mb-4",
      isCurrentUser ? "items-end" : "items-start",
      className
    )}>
      <div className={isCurrentUser ? "chat-bubble-sent" : "chat-bubble-received"}>
        <p className="whitespace-pre-wrap break-words">{message}</p>
      </div>

      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500 mx-2">{formattedTime}</span>

        {isCurrentUser && (
          <span className="text-xs text-gray-500">
            {status === 'read' ? (
              <span className="text-blue-500">✓✓</span>
            ) : status === 'delivered' ? (
              <span>✓✓</span>
            ) : (
              <span>✓</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;

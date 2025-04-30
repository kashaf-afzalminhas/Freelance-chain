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
      "flex flex-col mb-4 max-w-[90%] md:max-w-[80%] lg:max-w-[70%]",
      isCurrentUser ? "items-end ml-auto" : "items-start mr-auto",
      className
    )}>
      <div className={cn(
        "rounded-2xl px-4 py-2 text-sm md:text-base",
        "whitespace-pre-wrap break-words",
        "shadow-sm",
        isCurrentUser 
          ? "bg-primary text-white rounded-br-none" 
          : "bg-gray-100 text-gray-800 rounded-bl-none",
        "transition-colors duration-200"
      )}>
        <p className="font-body">{message}</p>
      </div>

      <div className={cn(
        "flex items-center mt-1",
        isCurrentUser ? "flex-row-reverse" : ""
      )}>
        <span className="text-xs text-gray-500 mx-1 font-body">
          {formattedTime}
        </span>

        {isCurrentUser && (
          <span className="text-xs mx-1">
            {status === 'read' ? (
              <span className="text-accent">✓✓</span>
            ) : status === 'delivered' ? (
              <span className="text-gray-400">✓✓</span>
            ) : (
              <span className="text-gray-400">✓</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;

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

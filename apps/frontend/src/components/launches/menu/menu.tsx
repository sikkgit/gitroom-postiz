import { FC, useCallback, useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { deleteDialog } from '@gitroom/react/helpers/delete.dialog';
import { useToaster } from '@gitroom/react/toaster/toaster';

export const Menu: FC<{
  canEnable: boolean;
  canDisable: boolean;
  id: string;
  onChange: (shouldReload: boolean) => void;
}> = (props) => {
  const { canEnable, canDisable, id, onChange } = props;
  const fetch = useFetch();
  const toast = useToaster();
  const [show, setShow] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    setShow(false);
  });

  const changeShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  const disableChannel = useCallback(async () => {
    if (
      !(await deleteDialog(
        'Are you sure you want to disable this channel?',
        'Disable Channel'
      ))
    ) {
      return;
    }
    await fetch('/integrations/disable', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    toast.show('Channel Disabled', 'success');
    setShow(false);
    onChange(false);
  }, []);

  const deleteChannel = useCallback(async () => {
    if (
      !(await deleteDialog(
        'Are you sure you want to delete this channel?',
        'Delete Channel'
      ))
    ) {
      return;
    }
    const deleteIntegration = await fetch('/integrations', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    if (deleteIntegration.status === 406) {
      toast.show(
        'You have to delete all the posts associated with this channel before deleting it',
        'warning'
      );
      return;
    }

    toast.show('Channel Deleted', 'success');
    setShow(false);
    onChange(true);
  }, []);

  const enableChannel = useCallback(async () => {
    await fetch('/integrations/enable', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    toast.show('Channel Enabled', 'success');
    setShow(false);
    onChange(false);
  }, []);

  return (
    <div
      className="cursor-pointer relative select-none"
      onClick={changeShow}
      ref={ref}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M13.125 12C13.125 12.2225 13.059 12.44 12.9354 12.625C12.8118 12.81 12.6361 12.9542 12.4305 13.0394C12.225 13.1245 11.9988 13.1468 11.7805 13.1034C11.5623 13.06 11.3618 12.9528 11.2045 12.7955C11.0472 12.6382 10.94 12.4377 10.8966 12.2195C10.8532 12.0012 10.8755 11.775 10.9606 11.5695C11.0458 11.3639 11.19 11.1882 11.375 11.0646C11.56 10.941 11.7775 10.875 12 10.875C12.2984 10.875 12.5845 10.9935 12.7955 11.2045C13.0065 11.4155 13.125 11.7016 13.125 12ZM12 6.75C12.2225 6.75 12.44 6.68402 12.625 6.5604C12.81 6.43679 12.9542 6.26109 13.0394 6.05552C13.1245 5.84995 13.1468 5.62375 13.1034 5.40552C13.06 5.1873 12.9528 4.98684 12.7955 4.82951C12.6382 4.67217 12.4377 4.56503 12.2195 4.52162C12.0012 4.47821 11.775 4.50049 11.5695 4.58564C11.3639 4.67078 11.1882 4.81498 11.0646 4.99998C10.941 5.18499 10.875 5.4025 10.875 5.625C10.875 5.92337 10.9935 6.20952 11.2045 6.4205C11.4155 6.63147 11.7016 6.75 12 6.75ZM12 17.25C11.7775 17.25 11.56 17.316 11.375 17.4396C11.19 17.5632 11.0458 17.7389 10.9606 17.9445C10.8755 18.15 10.8532 18.3762 10.8966 18.5945C10.94 18.8127 11.0472 19.0132 11.2045 19.1705C11.3618 19.3278 11.5623 19.435 11.7805 19.4784C11.9988 19.5218 12.225 19.4995 12.4305 19.4144C12.6361 19.3292 12.8118 19.185 12.9354 19C13.059 18.815 13.125 18.5975 13.125 18.375C13.125 18.0766 13.0065 17.7905 12.7955 17.5795C12.5845 17.3685 12.2984 17.25 12 17.25Z"
          fill="#506490"
        />
      </svg>
      {show && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[100%] left-0 p-[8px] px-[20px] bg-fifth flex flex-col gap-[16px] z-[100] rounded-[8px] border border-tableBorder font-['Inter'] text-nowrap"
        >
          {canEnable && (
            <div
              className="flex gap-[12px] items-center"
              onClick={enableChannel}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M28.2325 12.8525C27.7612 12.36 27.2738 11.8525 27.09 11.4062C26.92 10.9975 26.91 10.32 26.9 9.66375C26.8813 8.44375 26.8612 7.06125 25.9 6.1C24.9387 5.13875 23.5562 5.11875 22.3363 5.1C21.68 5.09 21.0025 5.08 20.5938 4.91C20.1488 4.72625 19.64 4.23875 19.1475 3.7675C18.285 2.93875 17.305 2 16 2C14.695 2 13.7162 2.93875 12.8525 3.7675C12.36 4.23875 11.8525 4.72625 11.4062 4.91C11 5.08 10.32 5.09 9.66375 5.1C8.44375 5.11875 7.06125 5.13875 6.1 6.1C5.13875 7.06125 5.125 8.44375 5.1 9.66375C5.09 10.32 5.08 10.9975 4.91 11.4062C4.72625 11.8512 4.23875 12.36 3.7675 12.8525C2.93875 13.715 2 14.695 2 16C2 17.305 2.93875 18.2837 3.7675 19.1475C4.23875 19.64 4.72625 20.1475 4.91 20.5938C5.08 21.0025 5.09 21.68 5.1 22.3363C5.11875 23.5562 5.13875 24.9387 6.1 25.9C7.06125 26.8612 8.44375 26.8813 9.66375 26.9C10.32 26.91 10.9975 26.92 11.4062 27.09C11.8512 27.2738 12.36 27.7612 12.8525 28.2325C13.715 29.0613 14.695 30 16 30C17.305 30 18.2837 29.0613 19.1475 28.2325C19.64 27.7612 20.1475 27.2738 20.5938 27.09C21.0025 26.92 21.68 26.91 22.3363 26.9C23.5562 26.8813 24.9387 26.8612 25.9 25.9C26.8612 24.9387 26.8813 23.5562 26.9 22.3363C26.91 21.68 26.92 21.0025 27.09 20.5938C27.2738 20.1488 27.7612 19.64 28.2325 19.1475C29.0613 18.285 30 17.305 30 16C30 14.695 29.0613 13.7162 28.2325 12.8525ZM26.7887 17.7638C26.19 18.3888 25.57 19.035 25.2412 19.8288C24.9262 20.5913 24.9125 21.4625 24.9 22.3062C24.8875 23.1812 24.8738 24.0975 24.485 24.485C24.0963 24.8725 23.1862 24.8875 22.3062 24.9C21.4625 24.9125 20.5913 24.9262 19.8288 25.2412C19.035 25.57 18.3888 26.19 17.7638 26.7887C17.1388 27.3875 16.5 28 16 28C15.5 28 14.8562 27.385 14.2362 26.7887C13.6163 26.1925 12.965 25.57 12.1713 25.2412C11.4088 24.9262 10.5375 24.9125 9.69375 24.9C8.81875 24.8875 7.9025 24.8738 7.515 24.485C7.1275 24.0963 7.1125 23.1862 7.1 22.3062C7.0875 21.4625 7.07375 20.5913 6.75875 19.8288C6.43 19.035 5.81 18.3888 5.21125 17.7638C4.6125 17.1388 4 16.5 4 16C4 15.5 4.615 14.8562 5.21125 14.2362C5.8075 13.6163 6.43 12.965 6.75875 12.1713C7.07375 11.4088 7.0875 10.5375 7.1 9.69375C7.1125 8.81875 7.12625 7.9025 7.515 7.515C7.90375 7.1275 8.81375 7.1125 9.69375 7.1C10.5375 7.0875 11.4088 7.07375 12.1713 6.75875C12.965 6.43 13.6112 5.81 14.2362 5.21125C14.8612 4.6125 15.5 4 16 4C16.5 4 17.1438 4.615 17.7638 5.21125C18.3838 5.8075 19.035 6.43 19.8288 6.75875C20.5913 7.07375 21.4625 7.0875 22.3062 7.1C23.1812 7.1125 24.0975 7.12625 24.485 7.515C24.8725 7.90375 24.8875 8.81375 24.9 9.69375C24.9125 10.5375 24.9262 11.4088 25.2412 12.1713C25.57 12.965 26.19 13.6112 26.7887 14.2362C27.3875 14.8612 28 15.5 28 16C28 16.5 27.385 17.1438 26.7887 17.7638ZM21.7075 12.2925C21.8005 12.3854 21.8742 12.4957 21.9246 12.6171C21.9749 12.7385 22.0008 12.8686 22.0008 13C22.0008 13.1314 21.9749 13.2615 21.9246 13.3829C21.8742 13.5043 21.8005 13.6146 21.7075 13.7075L14.7075 20.7075C14.6146 20.8005 14.5043 20.8742 14.3829 20.9246C14.2615 20.9749 14.1314 21.0008 14 21.0008C13.8686 21.0008 13.7385 20.9749 13.6171 20.9246C13.4957 20.8742 13.3854 20.8005 13.2925 20.7075L10.2925 17.7075C10.1049 17.5199 9.99944 17.2654 9.99944 17C9.99944 16.7346 10.1049 16.4801 10.2925 16.2925C10.4801 16.1049 10.7346 15.9994 11 15.9994C11.2654 15.9994 11.5199 16.1049 11.7075 16.2925L14 18.5863L20.2925 12.2925C20.3854 12.1995 20.4957 12.1258 20.6171 12.0754C20.7385 12.0251 20.8686 11.9992 21 11.9992C21.1314 11.9992 21.2615 12.0251 21.3829 12.0754C21.5043 12.1258 21.6146 12.1995 21.7075 12.2925Z"
                    fill="#06ff00"
                  />
                </svg>
              </div>
              <div className="text-[12px]">Enable Channel</div>
            </div>
          )}

          {canDisable && (
            <div
              className="flex gap-[12px] items-center"
              onClick={disableChannel}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM27 16C27.0026 18.5719 26.0993 21.0626 24.4488 23.035L8.96501 7.55C10.5713 6.21372 12.5249 5.36255 14.5972 5.0961C16.6696 4.82964 18.775 5.15892 20.667 6.04541C22.5591 6.93189 24.1595 8.33891 25.281 10.1018C26.4026 11.8647 26.9988 13.9106 27 16ZM5.00001 16C4.99745 13.4281 5.90069 10.9374 7.55126 8.965L23.035 24.45C21.4288 25.7863 19.4751 26.6374 17.4028 26.9039C15.3304 27.1704 13.225 26.8411 11.333 25.9546C9.44096 25.0681 7.84053 23.6611 6.71899 21.8982C5.59745 20.1353 5.0012 18.0894 5.00001 16Z"
                    fill="#F97066"
                  />
                </svg>
              </div>
              <div className="text-[12px]">Disable Channel</div>
            </div>
          )}

          <div className="flex gap-[12px] items-center" onClick={deleteChannel}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M13.5 3H11V2.5C11 2.10218 10.842 1.72064 10.5607 1.43934C10.2794 1.15804 9.89782 1 9.5 1H6.5C6.10218 1 5.72064 1.15804 5.43934 1.43934C5.15804 1.72064 5 2.10218 5 2.5V3H2.5C2.36739 3 2.24021 3.05268 2.14645 3.14645C2.05268 3.24021 2 3.36739 2 3.5C2 3.63261 2.05268 3.75979 2.14645 3.85355C2.24021 3.94732 2.36739 4 2.5 4H3V13C3 13.2652 3.10536 13.5196 3.29289 13.7071C3.48043 13.8946 3.73478 14 4 14H12C12.2652 14 12.5196 13.8946 12.7071 13.7071C12.8946 13.5196 13 13.2652 13 13V4H13.5C13.6326 4 13.7598 3.94732 13.8536 3.85355C13.9473 3.75979 14 3.63261 14 3.5C14 3.36739 13.9473 3.24021 13.8536 3.14645C13.7598 3.05268 13.6326 3 13.5 3ZM6 2.5C6 2.36739 6.05268 2.24021 6.14645 2.14645C6.24021 2.05268 6.36739 2 6.5 2H9.5C9.63261 2 9.75979 2.05268 9.85355 2.14645C9.94732 2.24021 10 2.36739 10 2.5V3H6V2.5ZM12 13H4V4H12V13ZM7 6.5V10.5C7 10.6326 6.94732 10.7598 6.85355 10.8536C6.75979 10.9473 6.63261 11 6.5 11C6.36739 11 6.24021 10.9473 6.14645 10.8536C6.05268 10.7598 6 10.6326 6 10.5V6.5C6 6.36739 6.05268 6.24021 6.14645 6.14645C6.24021 6.05268 6.36739 6 6.5 6C6.63261 6 6.75979 6.05268 6.85355 6.14645C6.94732 6.24021 7 6.36739 7 6.5ZM10 6.5V10.5C10 10.6326 9.94732 10.7598 9.85355 10.8536C9.75979 10.9473 9.63261 11 9.5 11C9.36739 11 9.24021 10.9473 9.14645 10.8536C9.05268 10.7598 9 10.6326 9 10.5V6.5C9 6.36739 9.05268 6.24021 9.14645 6.14645C9.24021 6.05268 9.36739 6 9.5 6C9.63261 6 9.75979 6.05268 9.85355 6.14645C9.94732 6.24021 10 6.36739 10 6.5Z"
                  fill="#F97066"
                />
              </svg>
            </div>
            <div className="text-[12px]">Delete</div>
          </div>
        </div>
      )}
    </div>
  );
};

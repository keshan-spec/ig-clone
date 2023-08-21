import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Dropzone from 'react-dropzone'
import { createPost } from '../../api/posts'
import { useObservedQuery } from '../../hooks/useObservedQuery'
import { Toast } from '../Toast/Toast'

export interface ICreatePostModalProps {
    setOpen: (state: boolean) => void;
    open: boolean;
}

export const CreatePostModal: React.FC<ICreatePostModalProps> = ({
    setOpen,
    open
}) => {
    const [images, setImages] = useState<any[]>([]); // [image1, image2, ...]
    const [imageDataURL, setImageDataURL] = useState<string | ArrayBuffer | null>(null);
    const [description, setDescription] = useState<string>('');

    const [message, setMessage] = useState<string>('');

    const { refetch } = useObservedQuery();

    useEffect(() => {
        const selectedImage = images[0];
        if (selectedImage && selectedImage instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageDataURL(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        }
    }, [images]);

    // remove toast after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const cancelButtonRef = useRef(null)

    const renderCreatePostForm = () => {
        return (
            <>
                {images.length > 0 ?
                    <div className="flex flex-wrap">
                        <div className="max-w-xs w-24 relative">
                            <div
                                className="absolute -top-2 -right-2 bg-white/40 rounded-full p-1 cursor-pointer h-6 w-6 flex items-center justify-center"
                                onClick={() => setImages([])}
                            >
                                <i className="fas fa-times text-white text-xs"></i>
                            </div>
                            <img
                                src={imageDataURL as string}
                                alt="preview"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div> :
                    <Dropzone onDrop={acceptedFiles => setImages(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="min-h-[200px] bg-zinc-700 hover:bg-zinc-600 transition-all p-3 w-full rounded-xl cursor-pointer flex items-center justify-center">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} className='w-full h-full' />
                                    {/* huge plus icon */}
                                    <i className="fat fa-plus text-5xl text-gray-400"></i>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                }
                <textarea className="w-full mt-5 p-1 pt-2 px-4  bg-zinc-700 rounded-xl text-white border-none focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-50"
                    wrap="hard" rows={5}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </>
        );
    }

    const handlePostSubmit = async () => {
        if (images.length === 0) return setMessage('Image is required.');
        if (!description) return setMessage('Description is required.');

        const data = await createPost({ description, image: images[0] });

        if (data && data.error) return setMessage(data.error);

        setMessage('Post created successfully.');
        setOpen(false);
        refetch();
    }

    return (
        <>
            {message && <Toast message={message} />}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="block md:flex lg:flex min-h-full justify-center p-4 text-center items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-800  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-zinc-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="w-full">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-xl mb-4 font-semibold leading-6 text-center text-white">
                                                    Create Post
                                                </Dialog.Title>
                                                <div className="mt-2 w-full">
                                                    {renderCreatePostForm()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-800 px-4 py-6 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm sm:ml-3 sm:w-auto"
                                            onClick={handlePostSubmit}
                                        >
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-full bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

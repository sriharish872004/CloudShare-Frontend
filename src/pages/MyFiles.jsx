import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { Copy, Download, Eye, File, Globe, Grid, List, Lock, Trash, Video, FileText, Image, Music } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import FileCard from '../components/FileCard';
import { apiEndpoints } from '../util/apiEndpoints';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LinkShareModal from '../components/LinkShareModal';

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const {getToken} = useAuth();
  const navigate = useNavigate();

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    fileId: null
  });
  const [shareModal, setShareModal] = useState({
          isOpen: false,
          fileId: null,
          link: ""
      });

  // fetching file for loggedIn in users
  const fetchFiles = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.FETCH_FILES, {headers: {Authorization: `Bearer ${token}`}});
        if(response.status === 200){
          // console.log(response.data);
          setFiles(response.data);
        }
    } catch (error){
        console.log('Error of fetching the files from server: ', error);
        toast.error('Error of fetching the files from server: ', error.message);
    }
  }

  // Toggle Public / private 
const togglePublic = async (fileToUpdate) => {
  try {
    const token = await getToken();
    await axios.patch(
      apiEndpoints.TOGGLE_FILES(fileToUpdate.id), 
      {}, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setFiles(files.map((file) =>
      file.id === fileToUpdate.id ? { ...file, isPublic: !file.isPublic } : file
    ));
  } catch (error) {
    console.error('Error in toggling file status: ', error);
    toast.error(`Error in toggling file status: ${error.message}`);
  }
};


  // Handle file download
  const handleDownload = async (file) => {
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), {headers: {Authorization: `Bearer ${token}`}, responseType: 'blob'});

      // create a blob url and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute("download", file.name);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // cleanup the Obj URL
    } catch (error) {
      console.error('Error in Downloading the file: ', error);
      toast.error('Error in Downloading the file: ', error.message);
    }
  }


  // Closes the delete confirmation
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      fileId: null
    })
  }
  // Open the delete confirmation
  const openDeleteConfirmation = (fileId) => {
    setDeleteConfirmation({
      isOpen: true,
      fileId
    })
  }

    //opens the share link modal
    const openShareModal = (fileId) => {
        const link = `${window.location.origin}/file/${fileId}`;
        setShareModal({
            isOpen: true,
            fileId,
            link
        });
    }
    //close the share link modal
    const closeShareModal = () => {
        setShareModal({
            isOpen: false,
            fileId: null,
            link: ""
        });
    }

  // Delete a file after Confirmation
  const handleDelete = async () => {
    const fileId = deleteConfirmation.fileId;
    if(!fileId) return;
    try {
      const token = await getToken();
      const response = await axios.delete(apiEndpoints.DELETE_FILE(fileId), {headers: {Authorization: `Bearer ${token}`}});

      if(response.status === 204){
        setFiles(files.filter((file) => file.id !== fileId));
        closeDeleteConfirmation();
      } else {
        toast.error('Error deleting file');
      }
    } catch (error) {
      console.error('Error Deleting file: ', error);
      toast.error('Error Deleting the file: ', error.message);
    }
  }

  

  useEffect(() => {
  fetchFiles();
  }, [getToken])

   const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        // image format
        if(['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].includes(extension)) {
            return <Image size={24} className='text-purple-500' />
        }
        // video format
        if(['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
            return <Video size={24} className='text-blue-500' />
        }
        // audio format
        if(['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return <Music size={24} className='text-green-500' />
        }
        // file format
        if(['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
            return <FileText size={24} className='text-amber-500' />
        }

        return <File size={24} className='text-blue-500' />
    }


  return (
    <DashboardLayout activeMenu="My Files">
      <div className='p-6'>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setViewMode('list')}>
            <List
              size={24}
              className={`cursor-pointer transition-colors ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            />
            </button>

            <button onClick={() => setViewMode('grid')}>
            <Grid
              size={24}
              className={`cursor-pointer transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              />
            </button>
          </div>
        </div>
        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
            <File
              size={60}
              className='text-blue-300 mb-3' 
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No files uploaded yet
            </h3>
            <p className='text-gray-500 text-center max-w-md mb-6'>
              Start uploading files to see them listed here.you can upload documents, images, and other files to share and manage them securely.
            </p>
            <button 
            onClick={() => navigate('/upload')}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
              Go to Upload
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {files.map((file) => (
              <FileCard 
                key={file.id}
                file={file}
                onDelete={openDeleteConfirmation}
                onTogglePublic={togglePublic}
                onDownload={handleDownload}
                onShareLink={openShareModal}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {files.map((file) => (
                  <tr key={file.id} className='hover:bg-gray-50 transition-colors'>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      <div className='flex items-center gap-2'>
                        {getFileIcon(file)}
                        {file.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => togglePublic(file)}
                          className='flex items-center gap-2 cursor-pointer group'>
                          {file.isPublic ? (
                            <>
                              <Globe size={16} className='text-green-500' />
                            <span className="group-hover:underline">
                              Public
                            </span>
                            </>
                          ) : (
                            <> 
                              <Lock size={16} className='text-gray-500' />
                            <span className="group-hover:underline">
                              Private
                            </span>
                            </>
                          )}
                        </button>
                        {file.isPublic && (
                          <button 
                            onClick={() => openShareModal(file.id)}
                            className="flex items-center gap-2 cursor-pointer group text-blue-600">
                            <Copy size={16} />
                            <span className='group-hover:underline '>
                              Share Link
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-center">
                          <button 
                          title='Download'
                          onClick={() => handleDownload(file)}
                          className="text-gray-500 hover:text-blue-300">
                              <Download size={18} />
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <button 
                          title='Delete'
                          onClick={() => openDeleteConfirmation(file.id)}
                          className="text-gray-500 hover:text-red-600">
                              <Trash size={18} /> 
                          </button>
                        </div>
                        <div className="flex justify-center">
                          {file.isPublic ? (
                            <a 
                              href={`file/${file.id}`}
                              title='View file'
                              target='_blank'
                              rel='noreferrer'
                              className='text-gray-500 hover:text-blue-600'
                            >
                                <Eye size={18} />
                            </a>
                          ) : (
                            <span className='w-[18px]'></span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog 
          isOpen={deleteConfirmation.isOpen}
          onClose={closeDeleteConfirmation}
          title='Delete File'
          message='Are you sure what to delete this file? This action cannot be undone.'
          confirmText='Delete'
          cancelText='Cancel'
          onConfirm={handleDelete}
          confirmationButtonClass='bg-red-600 hover:bg-red-700'
        />

         {/* Share link modal */}
            <LinkShareModal
                isOpen={shareModal.isOpen}
                onClose={closeShareModal}
                link={shareModal.link}
                title="Share File"
            />
      </div>
    </DashboardLayout>
  )
}

export default MyFiles
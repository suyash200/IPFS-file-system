/// pages/files.tsx
"use client"
import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Download, Trash2, ChevronLeft, ChevronRight, Share, Clipboard } from 'lucide-react';
import { pinata } from '@/utils/config';
import { redirect, useRouter } from 'next/navigation';
import { downloadAndUseFile } from '@/utils/fetchIPFS';

// TypeScript interfaces
interface FileData {
  id: string;
  name: string;
  cid: string;
  size: string;
  creationDate: string;
  fileId: string;
}
export interface PinataFile {
  id: string;
  name: string;
  cid: string;
  ipfs_pin_hash?: string;
  size: number;
  date_pinned?: string;
  metadata?: {
    name?: string;
    keyvalues?: Record<string, any>;
  };
}

export default function FilesPage() {

  const [files, setFiles] = useState<PinataFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hellow, setHellow] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [cid, setCid] = useState()
  const inputFile: any = useRef(null);
  const [file, setFile] = useState("");
  const router = useRouter()
  const uploadFile = async (fileToUpload: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, `${fileToUpload.name}`);
      const request = await fetch("/api/files", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      const response = await request.json();
      console.log(response);
      setCid(response.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files", {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      const json = await res.json();
      return json
      //   setCid(json.ipfs_pin_hash);
    } catch (e) {
      console.log(e);
      alert("trouble loading files");
    }
  };
  const deleteFile = async (id: string) => {
    try {
      const res = await fetch("api/files", {
        method: "DELETE",
        body: JSON.stringify({
          id: id
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        // Fetch files from Pinata
        //@ts-ignore
        const response = await loadRecent();
        console.log("the response is ", response, typeof response)
        // Transform the Pinata response to match our FileData interface
        //
        //@ts-ignore
        //const transformedFiles: PinataFile[] = await response.map((file: PinataFile) => {
        //return {
        //  id: file.id,
        //  name: file.name,
        //  cid: file.ipfs_pin_hash,
        //  size: formatFileSize(file.size),
        //  // creationDate: formatDate(file.date_pinned),
        //  fileId: file.id
        //};
        // })//;
        setHellow(response)
        //@ts-ignore
        setFiles(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching files from Pinata:", err);
        //  setError("Failed to load files. Please try again later.");
        // Fallback to sample data in case of error
        setFiles([
          {
            id: '1',
            name: 'BLC & DC.pdf',
            cid: 'bafyb...hs76u',
            size: 407.33,
            //    creationDate: '3/8/2025',
            //fileId: 'file-123'
          },
          {
            id: '2',
            name: 'AWS Certified Cloud Practitioner certificate.pdf',
            cid: 'bafkr...zhhve',
            size: 34.28,
            //creationDate: '3/8/2025',
            //fileId: 'file-456'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);
  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleFileSelection = (id: string): void => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
  };

  const toggleAllSelection = (): void => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const handleMenuToggle = (id: string): void => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleShare = (file: PinataFile) => {
    const generateLink = `https://${localStorage.getItem('pinataURL')}/ipfs/${file.ipfs_pin_hash}?pinataGatewayToken=${localStorage.getItem('pinataGateWayToken')}`
    console.log(generateLink);
    navigator.clipboard.writeText(generateLink)
    window.alert("link copied to clipboard")
  }
  const handleDownload = async (file: PinataFile) => {
    console.log(`Downloading file: ${file.ipfs_pin_hash}`);
    // Create a gateway URL for the file
    console.log("the file is", file);
    downloadAndUseFile(file)
    // redirect(gatewayUrl)
    // Open in a new tab or create a download link
    //router.push(gatewayUrl)
    //  const res = await fetch(gatewayUrl);
    // console.log(res)
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      // Implement actual delete from Pinata
      // await pinata.files.unpin(fileId);
      // Update local state after successful delete
      deleteFile(id)
      setFiles(files.filter(file => file.id !== id));
      setSelectedFiles(selectedFiles.filter(id => id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    const totalPages = Math.ceil(files.length / rowsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedFiles = files?.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(files?.length / rowsPerPage);

  // Close menu when clicking outside
  const handleClickOutside = (): void => {
    if (openMenuId) {
      setOpenMenuId(null);
    }
  };

  const handleChange = (e: any) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };
  return (
    <div className="p-6 max-w-6xl mx-auto" onClick={handleClickOutside}>
      <div className='flex flex-row gap-4'>
        <h1 className="text-2xl font-bold mb-6">Files</h1>
        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        <button
          disabled={uploading}
          onClick={() => inputFile.current.click()}
          className="w-[150px] bg-secondary text-light rounded-3xl py-2 px-2 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <p>Loading files...</p>

          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-6 text-center">
            <p>No files found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedFiles.length === files.length && files.length > 0}
                      onChange={toggleAllSelection}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IPFS PIN Hash
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SIZE
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CREATION DATE
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FILE ID
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{file.metadata?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        {file.ipfs_pin_hash}
                        <button
                          className="ml-2 text-blue-500"
                          onClick={() => {
                            navigator.clipboard.writeText(file.cid);
                            alert("CID copied to clipboard!");
                          }}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{file.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{file.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        {file.cid}
                        <button
                          className="ml-2 text-blue-500"
                          onClick={() => {
                            navigator.clipboard.writeText(file.cid);
                            alert("File ID copied to clipboard!");
                          }}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuToggle(file.id);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {openMenuId === file.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleShare(file)
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem">
                              <Share className="mr-3 h-4 w-4">
                                Share
                              </Share>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Download className="mr-3 h-4 w-4" />
                              Download
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(file.ipfs_pin_hash!);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
              className="ml-2 border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center">
            <button
              className="p-1 rounded-md hover:bg-gray-200"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className={`h-5 w-5 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-400'}`} />
            </button>
            <button
              className="p-1 rounded-md hover:bg-gray-200 ml-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className={`h-5 w-5 ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

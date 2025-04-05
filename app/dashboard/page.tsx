/// pages
"use client"
import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Download, Trash2, ChevronLeft, ChevronRight, Share, Clipboard, Upload, File, FileText } from 'lucide-react';
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
        const response = await loadRecent();
        console.log("the response is ", response, typeof response)
        setHellow(response)
        setFiles(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching files from Pinata:", err);
        setFiles([
          {
            id: '1',
            name: 'BLC & DC.pdf',
            cid: 'bafyb...hs76u',
            size: 407.33,
          },
          {
            id: '2',
            name: 'AWS Certified Cloud Practitioner certificate.pdf',
            cid: 'bafkr...zhhve',
            size: 34.28,
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
    console.log("the file is", file);
    downloadAndUseFile(file)
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
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
    <div className="bg-gray-50 min-h-screen" onClick={handleClickOutside}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Files</h1>
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
            className="flex items-center gap-2 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-sm"
          >
            <Upload size={18} />
            {uploading ? "Uploading..." : "Upload file"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500">Loading files...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-6">
              <FileText size={48} className="text-gray-300" />
              <p className="mt-4 text-gray-500">No files found</p>
              <button
                onClick={() => inputFile.current.click()}
                className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Upload size={16} />
                Upload your first file
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedFiles.length === files.length && files.length > 0}
                          onChange={toggleAllSelection}
                        />
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IPFS Hash
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <File size={16} className="text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">{file.metadata?.name || "Unnamed file"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="truncate max-w-xs">{file.ipfs_pin_hash}</span>
                            <button
                              className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                              onClick={() => {
                                navigator.clipboard.writeText(file.ipfs_pin_hash || '');
                                alert("Hash copied to clipboard!");
                              }}
                            >
                              <Clipboard size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{typeof file.size === 'number' ? formatFileSize(file.size) : file.size}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{file.date_pinned ? formatDate(file.date_pinned) : "—"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="truncate max-w-xs">{file.id}</span>
                            <button
                              className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                              onClick={() => {
                                navigator.clipboard.writeText(file.id);
                                alert("ID copied to clipboard!");
                              }}
                            >
                              <Clipboard size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuToggle(file.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === file.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 border border-gray-100">
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleShare(file)
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                                  role="menuitem">
                                  <Share size={16} className="mr-3 text-gray-500" />
                                  Share link
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                                  role="menuitem"
                                >
                                  <Download size={16} className="mr-3 text-gray-500" />
                                  Download
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(file.ipfs_pin_hash!);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                                  role="menuitem"
                                >
                                  <Trash2 size={16} className="mr-3 text-red-500" />
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

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="ml-2 border border-gray-300 rounded-md text-sm bg-white py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {startIndex + 1}-{Math.min(startIndex + rowsPerPage, files.length)} of {files.length}
                  </span>
                  <div className="flex">
                    <button
                      className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={20} className={currentPage === 1 ? 'text-gray-300' : 'text-gray-500'} />
                    </button>
                    <button
                      className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={20} className={currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

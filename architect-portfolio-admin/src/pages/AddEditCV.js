// src/pages/AddEditCV.js - FIXED VERSION - NO DUPLICATE SIDEBAR
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { cvService } from '../services/api';

const cvSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  cvFile: Yup.mixed().when('$isEdit', {
    is: false,
    then: Yup.mixed().required('CV file is required'),
  }),
});

const AddEditCV = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialValues, setInitialValues] = useState({
    title: '',
    cvFile: null,
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchCV = async () => {
        try {
          setLoading(true);
          const response = await cvService.getById(id);
          setInitialValues({
            title: response.data.data.title,
            cvFile: null,
          });
        } catch (error) {
          toast.error('Failed to load CV: ' + (error.message || 'Unknown error'));
          navigate('/cv', { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchCV();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      if (values.cvFile) {
        formData.append('cvFile', values.cvFile);
      }

      if (isEdit) {
        await cvService.update(id, formData);
        toast.success('CV updated successfully');
      } else {
        await cvService.create(formData);
        toast.success('CV added successfully');
      }
      navigate('/cv', { replace: true });
    } catch (error) {
      toast.error(isEdit ? 'Failed to update CV: ' + (error.message || 'Unknown error') : 'Failed to add CV: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">{isEdit ? 'Edit CV' : 'Add CV'}</h1>
          <p className="text-gray-500">{isEdit ? 'Update CV details' : 'Upload a new CV'}</p>
        </div>
        <Button to="/cv" variant="secondary">
          <FaArrowLeft className="mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={cvSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          context={{ isEdit }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="form-group">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                />
                <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">
                  CV File (PDF) {isEdit ? '' : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  name="cvFile"
                  id="cvFile"
                  accept="application/pdf"
                  onChange={(event) => setFieldValue('cvFile', event.currentTarget.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <ErrorMessage name="cvFile" component="div" className="mt-1 text-sm text-red-600" />
                {isEdit && values.cvFile && (
                  <p className="text-sm text-gray-500 mt-2">Leave empty to keep the existing file.</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  <FaSave className="mr-2" />
                  {isEdit ? 'Update CV' : 'Add CV'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default AddEditCV;
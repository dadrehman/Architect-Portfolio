// src/pages/AddEditBlog.js - FIXED VERSION - NO DUPLICATE SIDEBAR
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { blogService } from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const blogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  content: Yup.string().required('Content is required'),
  seo_title: Yup.string(),
  seo_description: Yup.string(),
});

const AddEditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    content: '',
    seo_title: '',
    seo_description: '',
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const response = await blogService.getById(id);
          const blog = response.data.data;
          setInitialValues({
            title: blog.title,
            description: blog.description,
            content: blog.content,
            seo_title: blog.seo_title || '',
            seo_description: blog.seo_description || '',
          });
        } catch (error) {
          toast.error('Failed to load blog: ' + (error.message || 'Unknown error'));
          navigate('/blogs');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await blogService.update(id, values);
        toast.success('Blog updated successfully');
      } else {
        await blogService.create(values);
        toast.success('Blog added successfully');
      }
      navigate('/blogs');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update blog: ' + (error.message || 'Unknown error') : 'Failed to add blog: ' + (error.message || 'Unknown error'));
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
          <h1 className="text-2xl font-medium text-gray-800">{isEdit ? 'Edit Blog Post' : 'Add Blog Post'}</h1>
          <p className="text-gray-500">{isEdit ? 'Update blog details' : 'Create a new blog post'}</p>
        </div>
        <Button to="/blogs" variant="secondary">
          <FaArrowLeft className="mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={blogSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  rows="3"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  value={values.content}
                  onChange={(value) => setFieldValue('content', value)}
                  className="bg-white border border-gray-300 rounded-md"
                  theme="snow"
                />
                <ErrorMessage name="content" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Title
                </label>
                <Field
                  type="text"
                  name="seo_title"
                  id="seo_title"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                />
                <ErrorMessage name="seo_title" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Description
                </label>
                <Field
                  as="textarea"
                  name="seo_description"
                  id="seo_description"
                  rows="3"
                  className="w-full rounded-md border-gray-300 shadow-sm px-4 py-3 bg-white border focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                />
                <ErrorMessage name="seo_description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  <FaSave className="mr-2" />
                  {isEdit ? 'Update Blog' : 'Add Blog'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default AddEditBlog;
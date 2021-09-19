export const adjustFormData = (formData) => {
    const adjustedFormData = {
        _id: formData._id,
        lessonName: formData.lessonName,
        createdAt: formData.createdAt
          ? new Date(parseInt(formData.createdAt))
          : null,
        published: formData.published,
        availableOnDate: formData.availableOnDate
          ? new Date(parseInt(formData.availableOnDate))
          : null,
        slides: formData.lessonSlides.map((slide) => {
          return {
            _id: slide._id,
            slideContent: slide.slideContent,
            videoFile: slide.video,
            audioFile: slide.audio,
            recordedBlob: slide.audio,
            loadedVideo: slide.video,
            videoContent: slide.video ? true : false,
          };
        }),
      };
    return adjustedFormData
}
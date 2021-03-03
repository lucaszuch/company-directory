//Global functions
//Get all personnel and append the cards
function getAllCards() {
  $.ajax({
    url: './libs/php/getAll.php',
    type: 'POST',
    dataType: 'json',
    success: (result) => {
      //console.log(result);
      result.data.forEach(employee => {
        $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
      });
    }, error: () => {
      console.log('Error');
    }
  });
}

//Get all departments and append content
function getAllDepartments() {
  $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'POST',
    dataType: 'json',
    success: (result) => {
      //console.log(result);
      result.data.forEach(dept => {
        $('#profile-department').append(`<option value="${dept.id}">${dept.name}</option>`);
        $('#edit-profile-department').append(`<option value="${dept.id}">${dept.name}</option>`);
        $('#department-filters').append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${dept.id}"><label class="form-check-label" for="${dept.name}">${dept.name}</label></div>`)
        $('#department-list').append(`<div class="department-box"><input class="form-control" value="${dept.name}" type="text"/><div class="btn-box"><button type="button" class="btn btn-outline-warning" value="${dept.id}">Edit</button><button type="button" class="btn btn-outline-danger" value="${dept.id}">Remove</button></div></div>`);
      });
    },
    error: () => {
      console.log('Server Error: Departments.');
    }
  });
}

//Get all locations and append content
function getAllLocations() {
  $.ajax({
    url: './libs/php/getAllLocations.php',
    type: 'POST',
    dataType: 'json',
    success: (result) => {
      result.data.forEach(location => {
        $('#location-filters').append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${location.id}"><label class="form-check-label" for="${location.name}">${location.name}</label></div>`)
        $('#department-location').append(`<option value="${location.id}">${location.name}</option>`)
        $('#location-list').append(`<div class="location-box"><input type="text" class="form-control" value="${location.name}"/><div class="btn-box"><button type="button" class="btn btn-outline-warning" value="${location.id}">Edit</button><button type="button" class="btn btn-outline-danger" value="${location.id}">Remove</button></div></div>`)
      });
    },
    error: () => {
      console.log('Server Error: Locations');
    } 
  });
}

//Reset window position
function scrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

//On document init
$('document').ready(function() {
  //Gets all the personnel information
  getAllCards();

  //Removes the loading screen from the top
  $('.loader-wrapper').fadeOut('slow');

  //Gets employee by first name
  $('#search').on('input', (e) => {
    e.preventDefault();
    $.ajax({
      url: './libs/php/getPersonnelByName.php',
      type: 'POST',
      dataType: 'json',
      data: {
        search: $('#search').val()
      },
      success: (result) => {
      //console.log(result)
        if(result.data.length > 0) {
          $('#cards-list').empty();
          result.data.forEach(employee => {
            $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
          });
        } 
      }, error: () => {
        console.log('Error')
      }
    });
  });

  //Resets new profile form
  function resetProfileForm() {
    $('#profile-firstName').val('');
    $('#profile-lastName').val('');
    $('#profile-jobTitle').val('');
    $('#profile-email').val('');
    $('#profile-department').val('');
  }

  //Create new profile
  $('#btn-create-profile').on('click', () => {
    //Checks if all the fields are filled and focus in case empty
    if (!$('#profile-firstName').val()) {
      $('#profile-firstName').focus();
    } else if (!$('#profile-lastName').val()) {
        $('#profile-lastName').focus();
    } else if (!$('#profile-jobTitle').val()) {
        $('#profile-jobTitle').focus();
    } else if (!$('#profile-email').val()) {
        $('#profile-email').focus();
    } else if (!$('#profile-department').val()) {
        $('#profile-department').focus();
    } else {
      $.ajax({
        url: './libs/php/insertPersonnel.php',
        type: 'POST',
        dataType: 'json',
        data: {
          firstName: $('#profile-firstName').val(),
          lastName: $('#profile-lastName').val(),
          jobTitle: $('#profile-jobTitle').val(),
          email: $('#profile-email').val(),
          departmentID: $('#profile-department').val()
        },
        success: () => {
          $('#alertMessage').html('Profile created')
          resetProfileForm()
          $('#alertModal').modal('show');
        },
        error: () => {
          $('#alertMessage').html('Something went wrong');
          $('#alertModal').modal('show');
        }
      });
    }
  });

  //Reset new profile form
  $('#btn-reset-profile').on('click', () => {
    resetProfileForm();
  });

  //Edit/delete profile
  $('#cards-list').on('click', (e) => {
    if(e.target.id === 'edit-profile') {
      let parsedTarget = parseInt($(e.target).parent().attr('id'));
      $.ajax({
        url: './libs/php/getPersonnelByID.php',
        type: 'POST',
        dataType: 'json',
        data: {
            search: parsedTarget
        },
          success: (result) => {
            //console.log(result);
            $('#edit-profile-firstName').val(result.data[0].firstName);
            $('#edit-profile-lastName').val(result.data[0].lastName);
            $('#edit-profile-jobTitle').val(result.data[0].jobTitle);
            $('#edit-profile-email').val(result.data[0].email);
            $('#edit-profile-department').val(result.data[0].id);
            $('#edit-profile-department').append(`<option value="${result.data[0].id}" selected>${result.data[0].department}</option>`);

            //Update profile
            $('#btn-save-editProfile').on('click', () => {
              $('#confirmEditModal').modal('show');
              $('#confirmEdit').on('click', () => {
                $.ajax({
                  url: './libs/php/updatePersonnelByID.php',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    targetID: parsedTarget,
                    editFirstName: $('#edit-profile-firstName').val(),
                    editLastName: $('#edit-profile-lastName').val(),
                    editJobTitle: $('#edit-profile-jobTitle').val(),
                    editEmail: $('#edit-profile-email').val(),
                    editDepartment: $('#edit-profile-department').val()
                  },
                  success: () => {
                    $('#alertMessage').html('Profile was updated')
                    $('#alertModal').modal('show');
                    $('#editProfile').modal('hide');
                  },
                  error: () => {
                    $('#alertMessage').html('Profile could not be updated');
                    $('#alertModal').modal('show');
                  }
                });
              });
            });
              
            //Remove profile
            $('#btn-remove-editProfile').on('click', () => {
              $('#confirmDeleteModal').modal('show');
              $('#confirmDelete').on('click', () => {
                $.ajax({
                  url: './libs/php/deletePersonnelByID.php',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    targetID: parsedTarget
                  },
                  success: () => {
                    $('#alertMessage').html('Profile removed successfully');
                    $('#alertModal').modal('show');
                    $('#editProfile').modal('hide');
                  },
                  error: () => {
                    $('#alertMessage').html('Profile could not be removed');
                    $('#alertModal').modal('show');
                  }
              });
            }); 
          });
  
          //Close modal and clean memory
          $('#btn-close-editProfile').on('click', () => {
            location.reload();
          });
          
          },
          error: () => {
            $('#alertMessage').html('Employee was not found');
            $('#alertModal').modal('show');
          }
      });
    }
  });

  //Get all departments
  getAllDepartments();

  //Reset department form
  function resetDeparmentForm() {
    $('#department-name').val('');
    $('#department-location').val('');
  }

  //Add new department
  $('#btn-newDepartment').on('click', () => {
    if (!$('#department-name').val()) {
      $('#department-name').focus();
    } else if (!$('#department-location').val()) {
        $('#department-location').focus();
    } else {
      $.ajax({
        url: './libs/php/insertDepartment.php',
        type: 'POST',
        dataType: 'json',
        data: {
          departmentName: $('#department-name').val(),
          departmentLocation: $('#department-location').val()
        },
        success: () => {
          $('#alertMessage').html('Deparment create');
          resetDeparmentForm();
          $('#alertModal').modal('show');
        },
        error: () => {
          $('#alertMessage').html('Something went wrong');
          resetDeparmentForm();
          $('#alertModal').modal('show');
        }
      });
    }  
  });

  //Edit department
  $('#department-list').on('click', (e) => {
    //Remove department
    if($(e.target).text() === 'Remove') {
      //Count personnel per department for dependecies
      $.ajax({
        url: './libs/php/countPersonnel.php',
        type: 'POST',
        dataType: 'json',
        data: {
          departmentID: e.target.value
        },
        success: (result) => {
          let parsedDeptCount = parseInt(result.data[0].PersonnelCount);
          if(parsedDeptCount === 0) {
            $('#confirmDeleteModal').modal('show');
            $('#confirmDelete').on('click', () => {
              $.ajax({
                url: './libs/php/deleteDepartmentByID.php',
                type: 'POST',
                dataType: 'json',
                data: {
                  departmentID: e.target.value
                },
                success: () => {
                  $('#alertMessage').html('Department removed');
                  $('#alertModal').modal('show');
                },
                error: () => {
                  $('#alertMessage').html('Department could not be removed');
                  $('#alertModal').modal('show');
                }
              });
            });
          } else {
            $('#alertMessage').html(`There are pending dependencies. Department cannot be removed.`);
            $('#alertModal').modal('show');
          }
        },
        error: () => {
          alert('Something went wrong');
        }
      });    
    }

    //Edit department info
    if($(e.target).text() === 'Edit') {
      $('#confirmEditModal').modal('show');
      $('#confirmEdit').on('click', () => {
        $.ajax({
          url: './libs/php/updateDepartmentByID.php',
          type: 'POST',
          dataType: 'json',
          data: {
            targetID: parseInt(e.target.value),
            targetDepartment: $(e.target).parent().parent().children().val()
          },
          success: () => {
            $('#alertMessage').html('Information was updated');
            $('#alertModal').modal('show');
          },
          error: () => {
            $('#alertMessage').html('Entry could not be updated');
            $('#alertModal').modal('show');
          }
        }); 
      }); 
    }
  });

  //Get all locations
  getAllLocations();

  //Reset location form
  function resetLocationForm() {
    $('#location-name').val('');
  }

  //Add new locatiom
  $('#btn-newLocation').on('click', () => {
    if(!$('#location-name').val()) {
      $('#location-name').focus();
    } else {
      $.ajax({
        url: './libs/php/insertLocation.php',
        type: 'POST',
        dataType: 'json',
        data: {
          locationName: $('#location-name').val(),
        },
        success: () => {
          $('#alertMessage').html('Location Created');
          resetLocationForm()
          $('#alertModal').modal('show');
        },
        error: () => {
          $('#alertMessage').html('Location could not be added');
          $('#alertModal').modal('show');
        }
      });
    }
  });

  //Edit location
  $('#location-list').on('click', (e) => {
    if($(e.target).text() === 'Remove') {
      //Count personnel per department for dependecies
        $.ajax({
          url: './libs/php/countDepartments.php',
          type: 'POST',
          dataType: 'json',
          data: {
            locationID: e.target.value
          },
          success: (result) => {
            let parsedLocationCount = parseInt(result.data[0].departmentCount);
            if(parsedLocationCount === 0) {
              $('#confirmDeleteModal').modal('show');
              $('#confirmDelete').on('click', () => {
                $.ajax({
                  url: './libs/php/deleteLocationByID.php',
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    locationID: e.target.value
                  },
                  success: () => {
                    $('#alertMessage').html('Location removed');
                    $('#alertModal').modal('show');
                  },
                  error: () => {
                    $('#alertMessage').html('Location could not be removed removed');
                    $('#alertModal').modal('show');
                  }
                });
              });
          } else {
            $('#alertMessage').html('There are pending dependencies. Location cannot be removed');
            $('#alertModal').modal('show');
          }
        },
        error: () => {
          console.log('Something went wrong.')
        }  
      });
    }

    //Edit location info
    if($(e.target).text() === 'Edit') {
      $('#confirmEditModal').modal('show');
      $('#ConfirmEdit').on('click', () => {
        $.ajax({
          url: './libs/php/updateLocationByID.php',
          type: 'POST',
          dataType: 'json',
          data: {
            targetID: parseInt(e.target.value),
            targetLocation: $(e.target).parent().parent().children().val()
          },
          success: () => {
            $('#alertMessage').html('Information was updated');
            $('#alertModal').modal('show');
          },
          error: () => {
            $('#alertMessage').html('Entry could not be updated.');
            $('#alertModal').modal('show');
          }
        }); 
      }); 
    }
  });

  //Deparment filters  
  $('#btn-filter-department').on('click', () => {
    $('.loader-wrapper').fadeIn('slow');
    let flaggedDepartments = [];
    $('#cards-list').empty();
    $('#department-filters input:checkbox:checked').each(function() {
      flaggedDepartments.push(parseInt($(this).val()));
    });

    if(flaggedDepartments.length > 0) {
      //Return cards for specified location
      for(let i = 0; i < flaggedDepartments.length; i++) {
        $.ajax({
          url: './libs/php/filterByDepartment.php',
          type: 'POST',
          dataType: 'json',
          data: {
            department: flaggedDepartments[i]
          },
          success: (result) => {
            let resultArr = result.data;
            resultArr.forEach(employee => {
              $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
            });
            scrollTop();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            $('#alertMessage').html('Departments filters could not be applied');
            $('#alertModal').modal('show');
            $('.loader-wrapper').fadeOut('slow');
          }
        });
      }
    } else {
      getAllCards();
      scrollTop();
      $('.loader-wrapper').fadeOut('slow');
    }
  });

  //Location filters  
  $('#btn-filter-location').on('click', () => {
    $('.loader-wrapper').fadeIn('slow');
    let flaggedLocations = [];
    $('#cards-list').empty();
    $('#location-filters input:checkbox:checked').each(function() {
      flaggedLocations.push(parseInt($(this).val()));
    });

    if(flaggedLocations.length > 0) {
      //Return cards for specified location
      for(let i = 0; i < flaggedLocations.length; i++) {
        $.ajax({
          url: './libs/php/filterByLocation.php',
          type: 'POST',
          dataType: 'json',
          data: {
            location: flaggedLocations[i]
          },
          success: (result) => {
            let resultArr = result.data;
            resultArr.forEach(employee => {
              $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
              scrollTop();
              $('.loader-wrapper').fadeOut('slow');
            });
          },
          error: () => {
            $('.loader-wrapper').fadeOut('slow');
            $('#alertMessage').html('Location filters could not be applied');
            $('#alertModal').modal('show');
          }
        });
      }
    } else {
      getAllCards();
      scrollTop();
      $('.loader-wrapper').fadeOut('slow');
    }
  });

  //Confirmation modal
  $('#confirmMessage').on('click', () => {
    //Places the loader while querying new information
    $('.loader-wrapper').fadeIn('slow');

    //Reset cards
    $('#cards-list').empty();
    getAllCards();

    //Reset department list
    $('#profile-department').empty();
    $('#edit-profile-department').empty();
    $('#department-filters').empty();
    $('#department-list').empty();
    getAllDepartments();

    //Reset location list
    $('#location-filters').empty();
    $('#department-location').empty();
    $('#department-location').append(`<option value disabled hidden selected>Choose a location</option>`);
    $('#location-list').empty();
    getAllLocations();

    //Reset alert message
    $('#alertMessage').empty();

    //Reset forms
    resetDeparmentForm();
    resetLocationForm();
    resetProfileForm();

    //Removes loading screen and close the modal
    $('.loader-wrapper').fadeOut('slow');
  });

  //Mobile buttons
  $('.btn-open').on('click', () => {
    $('.btn-closed').toggleClass('open', true);
    $('.btn-open').toggleClass('hidden', true);
    $('.filters-wrapper').toggle('hidden');
  });

  $('.btn-closed').on('click', () => {
    $('.btn-closed').toggleClass('open', false);
    $('.btn-open').toggleClass('hidden', false);
    $('.filters-wrapper').toggle('hidden');
  });

  //Reset all filters (department and location)  
  $('#btn-resetFilters-department').on('click', () => {
    $('#alertMessage').html('Would you like to reset the filters?');
    $('#alertModal').modal('show');
  });

  $('#btn-resetFilters-location').on('click', () => {
    $('#alertMessage').html('Would you like to reset the filters?');
    $('#alertModal').modal('show');
  });

  //Filters toggles
  $('.filter-title-department').on('click', () => {
    $('.filter-box-department').toggle('hidden');
  });

  $('.filter-title-location').on('click', () => {
    $('.filter-box-location').toggle('hidden');
  });
});
$('document').ready(function() {
    //Gets all the personnel information
    $.ajax({
      url: './libs/php/getAll.php',
      type: 'POST',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        if(result.status.name == 'ok') {
          result.data.forEach(employee => {
            $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
          });
        }
      }, error: () => {
        console.log('Error')
      }
    }); 
    //removes the loading screen from the top
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

    //Reset form - refactoring needed
    function resetProfileForm() {
      $('#profile-firstName').val('');
      $('#profile-lastName').val('');
      $('#profile-jobTitle').val('');
      $('#profile-email').val('');
      $('#profile-department').val('');
    }

    //All departments
    $.ajax({
      url: './libs/php/getAllDepartments.php',
      type: 'POST',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        result.data.forEach(dept => {
          $('#profile-department').append(`<option value="${dept.id}">${dept.name}</option>`);
          $('#edit-profile-department').append(`<option value="${dept.id}">${dept.name}</option>`);
          $('#department-filters').append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${dept.id}"><label class="form-check-label" for="${dept.name}">${dept.name}</label></div>`)
          $('#department-list').append(`<div class="department-box"><input class="form-control" value="${dept.name}" type="text"/><div class="btn-box"><button type="button" class="btn btn-outline-warning" value="${dept.id}">Edit</button><button type="button" class="btn btn-outline-danger" value="${dept.id}">Remove</button></div></div>`);
        })
      },
      error: () => {
        alert('Server Error: Departments.')
      }
    });

    //All locations
    $.ajax({
      url: './libs/php/getAllLocations.php',
      type: 'POST',
      dataType: 'json',
      success: (result) => {
        console.log(result);
        result.data.forEach(location => {
          $('#location-filters').append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${location.id}"><label class="form-check-label" for="${location.name}">${location.name}</label></div>`)
          $('#department-location').append(`<option value="${location.id}">${location.name}</option>`)
          $('#location-list').append(`<div class="location-box"><input type="text" class="form-control" value="${location.name}"/><div class="btn-box"><button type="button" class="btn btn-outline-warning" value="${location.id}">Edit</button><button type="button" class="btn btn-outline-danger" value="${location.id}">Remove</button></div></div>`)
        });
      },
      error: () => {
        alert('Server Error: Locations.')
      } 
    });

    //Create new profile
    $('#btn-create-profile').on('click', () => {
      //Checks if all the fields are filled and focus in case empty
      //Refactoring needed
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
          success: (result) => {
            if (result.status.name == "ok") {
              alert('Profile created.')
              $('.loader-wrapper').fadeIn('slow');
              location.reload();
              $('.loader-wrapper').fadeOut('slow');
            }
          },
          error: () => {
            alert('Something went wrong')
          }
       });
      }
    });

    //Reset new profile form
    $('#btn-reset-profile').on('click', (e) => {
      e.preventDefault();
      resetProfileForm();
    });

    //Edit/delete profile
    $('#cards-list').on('click', (e) => {
      if(e.target.id === 'edit-profile'){
        console.log($(e.target).parent().attr('id'));
        let parsedTarget = parseInt($(e.target).parent().attr('id'));
        $.ajax({
          url: './libs/php/getPersonnelByID.php',
            type: 'POST',
            dataType: 'json',
            data: {
                search: parsedTarget
            },
            success: (result) => {
              console.log(result);
              $('#edit-profile-firstName').val(result.data[0].firstName);
              $('#edit-profile-lastName').val(result.data[0].lastName);
              $('#edit-profile-jobTitle').val(result.data[0].jobTitle);
              $('#edit-profile-email').val(result.data[0].email);
              $('#edit-profile-department').val(result.data[0].id);
              $('#edit-profile-department').append(`<option value="${result.data[0].id}" selected>${result.data[0].department}</option>`);

              //Update profile
              $('#btn-save-editProfile').on('click', () => {
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
                    alert('Profile updated.');
                    $('.loader-wrapper').fadeIn('slow');
                    location.reload();
                    $('.loader-wrapper').fadeOut('slow');
                  },
                  error: () => {
                    alert(`Profile ${parsedTarget} could not be updated.`);
                  }
                });
              });

              //Remove profile
              $('#btn-remove-editProfile').on('click', () => {
                $.ajax({
                  url: './libs/php/deletePersonnelByID.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                      targetID: parsedTarget
                    },
                    success: () => {
                      alert(`Profile ${parsedTarget} removed successfully.`);
                      $('.loader-wrapper').fadeIn('slow');
                      location.reload();
                      $('.loader-wrapper').fadeOut('slow');
                    },
                    error: () => {
                      alert(`Profile ${parsedTarget} could not be removed.`);
                    }
                });
              });
              
              //Close modal and clean memory
              $('#btn-close-editProfile').on('click', () => {
                $('.loader-wrapper').fadeIn('slow');
                location.reload();
                $('.loader-wrapper').fadeOut('slow');
              });
            },
            error: () => {
              alert(`Employee id: ${$(e.target).parent().attr('id')} was not found.`);
            }
        });

      }
    });

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
            alert('Deparment create.');
            resetDeparmentForm();
            $('.loader-wrapper').fadeIn('slow');
            location.reload();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            alert('Department could not be created.');
            resetDeparmentForm();
          }
        });
      }  
    });

    //Edit department
    $('#department-list').on('click', (e) => {
      //Remove department
      if($(e.target).text() === 'Remove') {
        $.ajax({
          url: './libs/php/deleteDepartmentByID.php',
          type: 'POST',
          dataType: 'json',
          data: {
            departmentID: e.target.value
          },
          success: () => {
            alert('Department Removed.');
            $('.loader-wrapper').fadeIn('slow');
            location.reload();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            alert('Department could not be deleted.');
          }
       }); 
      }

      //Edit department info
      if($(e.target).text() === 'Edit') {
        $.ajax({
          url: './libs/php/updateDepartmentByID.php',
          type: 'POST',
          dataType: 'json',
          data: {
            targetID: parseInt(e.target.value),
            targetDepartment: $(e.target).parent().parent().children().val()
          },
          success: () => {
            alert('Department updated.');
            $('.loader-wrapper').fadeIn('slow');
            location.reload();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            alert('Department could not be edited.');
          }
        }); 
      }
    });

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
            alert('Location create.');
            $('#location-name').val('');
            $('.loader-wrapper').fadeIn('slow');
            location.reload();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            alert('Location could not be created.')
            $('#location-name').val('');
          }
        });
      }
    });

    //Edit location
    $('#location-list').on('click', (e) => {
      //Remove location
      if($(e.target).text() === 'Remove') {
        $.ajax({
          url: './libs/php/deleteLocationByID.php',
          type: 'POST',
          dataType: 'json',
          data: {
            locationID: e.target.value
          },
          success: () => {
            alert('Location Removed.');
            $('.loader-wrapper').fadeIn('slow');
            location.reload();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            alert('Location could not be deleted.');
          }
        }); 
      }

      //Edit location info
      if($(e.target).text() === 'Edit') {
        $.ajax({
          url: './libs/php/updateLocationByID.php',
          type: 'POST',
          dataType: 'json',
          data: {
            targetID: parseInt(e.target.value),
            targetLocation: $(e.target).parent().parent().children().val()
          },
          success: () => {
            alert('Location updated.');
            $('.loader-wrapper').fadeIn('slow');
            location.reload();
            $('.loader-wrapper').fadeOut('slow');
          },
          error: () => {
            alert('Location could not be edited.');
          }
        }); 
      }
    });

    //Deparment filters  
    $('#btn-filter-department').on('click', () => {
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
            },
            error: () => {
              alert('Department filters could not be applied.');
            }
          });
        }
      } else {
        //Returns all
        $.ajax({
          url: './libs/php/getAll.php',
          type: 'POST',
          dataType: 'json',
          success: (result) => {
            if(result.status.name == 'ok') {
              result.data.forEach(employee => {
                $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
              });
            }
          }, error: () => {
            console.log('Error');
          }
        });
      }
    });

    //Location filters  
    $('#btn-filter-location').on('click', () => {
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
              });
            },
            error: () => {
              alert('Location filters could not be applied.');
            }
          });
        }
      } else {
        //Returns all
        $.ajax({
          url: './libs/php/getAll.php',
          type: 'POST',
          dataType: 'json',
          success: (result) => {
            if(result.status.name == 'ok') {
              result.data.forEach(employee => {
                $('#cards-list').append(`<div class="card-model" id="${employee.id}"><img src="./libs/img/avatar.png" alt="avatar"><div class="card-content"><ul><li>${employee.firstName} ${employee.lastName}</li><li>${employee.jobTitle}</li><li>${employee.email}</li><li>${employee.department}</li><li>${employee.location}</li></ul></div><div class="btn-edit" id="edit-profile" data-bs-toggle="modal" data-bs-target="#editProfile"><i class="fas fa-ellipsis-v"></i></div></div>`);
              });
            }
          }, error: () => {
            console.log('Error');
          }
        });
      }
    });

    //Reset all filters (department and location)
    $('#btn-resetFilters-department').on('click', () => {
      $('.loader-wrapper').fadeIn('slow');
      location.reload();
      $('.loader-wrapper').fadeOut('slow');
    });

    $('#btn-resetFilters-location').on('click', () => {
      $('.loader-wrapper').fadeIn('slow');
      location.reload();
      $('.loader-wrapper').fadeOut('slow');
    });
});

//Menu toggles
$('.filter-title-department').on('click', () => {
  $('.filter-box-department').toggle('hidden');
});

$('.filter-title-location').on('click', () => {
  $('.filter-box-location').toggle('hidden');
});

$('.btn-open').on('click', () => {
  $('.btn-closed').toggleClass('hidden', false);
  $('.btn-open').toggleClass('hidden', true);
  $('.filters-wrapper').toggle('hidden');
  $('.cards-wrapper').toggleClass('view', false);
});

$('.btn-closed').on('click', () => {
  $('.btn-open').toggleClass('hidden', false);
  $('.btn-closed').toggleClass('hidden', true);
  $('.filters-wrapper').toggle('hidden');
  $('.cards-wrapper').toggleClass('view', true);
});